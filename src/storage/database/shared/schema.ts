import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean, integer, numeric, jsonb, index, serial, bigint } from "drizzle-orm/pg-core";

// 系统表 - 必须保留
export const healthCheck = pgTable("health_check", {
  id: serial().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
});

// 用户资料表（扩展 Supabase Auth）
export const userProfiles = pgTable(
  "user_profiles",
  {
    id: varchar("id", { length: 36 }).primaryKey(), // 关联 auth.users.id
    email: varchar("email", { length: 255 }).notNull(),
    name: varchar("name", { length: 128 }).notNull(),
    phone: varchar("phone", { length: 20 }),
    avatar_url: varchar("avatar_url", { length: 500 }),
    role: varchar("role", { length: 20 }).notNull().default('user'), // user, vendor, admin
    vendor_id: varchar("vendor_id", { length: 36 }), // 所属厂家ID（商家端用户）
    is_active: boolean("is_active").default(true).notNull(),
    last_login_at: timestamp("last_login_at", { withTimezone: true }),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true }),
  },
  (table) => [
    index("user_profiles_email_idx").on(table.email),
    index("user_profiles_role_idx").on(table.role),
    index("user_profiles_vendor_id_idx").on(table.vendor_id),
  ]
);

// 厂家表
export const vendors = pgTable(
  "vendors",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    name: varchar("name", { length: 128 }).notNull(),
    code: varchar("code", { length: 50 }).notNull().unique(),
    contact_name: varchar("contact_name", { length: 128 }),
    contact_phone: varchar("contact_phone", { length: 20 }),
    contact_email: varchar("contact_email", { length: 255 }),
    address: text("address"),
    status: varchar("status", { length: 20 }).notNull().default('pending'), // pending, approved, rejected
    device_count: integer("device_count").default(0),
    customer_count: integer("customer_count").default(0),
    monthly_revenue: numeric("monthly_revenue", { precision: 12, scale: 2 }).default('0'),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true }),
  },
  (table) => [
    index("vendors_code_idx").on(table.code),
    index("vendors_status_idx").on(table.status),
  ]
);

// 设备表
export const devices = pgTable(
  "devices",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    name: varchar("name", { length: 128 }).notNull(),
    serial_number: varchar("serial_number", { length: 100 }).notNull().unique(),
    vendor_id: varchar("vendor_id", { length: 36 }).notNull().references(() => vendors.id),
    owner_id: varchar("owner_id", { length: 36 }), // 设备所有者（用户）
    device_type: varchar("device_type", { length: 50 }).notNull(), // 生产设备、传感器等
    model: varchar("model", { length: 100 }),
    status: varchar("status", { length: 20 }).notNull().default('offline'), // online, offline, fault, maintenance
    location: varchar("location", { length: 200 }),
    latitude: numeric("latitude", { precision: 10, scale: 6 }),
    longitude: numeric("longitude", { precision: 10, scale: 6 }),
    install_date: timestamp("install_date", { withTimezone: true }),
    last_heartbeat_at: timestamp("last_heartbeat_at", { withTimezone: true }),
    metadata: jsonb("metadata"), // 设备元数据（配置信息等）
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true }),
  },
  (table) => [
    index("devices_serial_number_idx").on(table.serial_number),
    index("devices_vendor_id_idx").on(table.vendor_id),
    index("devices_owner_id_idx").on(table.owner_id),
    index("devices_status_idx").on(table.status),
  ]
);

// 设备实时数据表
export const deviceData = pgTable(
  "device_data",
  {
    id: bigint("id", { mode: "number" }).primaryKey().generatedByDefaultAsIdentity(),
    device_id: varchar("device_id", { length: 36 }).notNull().references(() => devices.id),
    temperature: numeric("temperature", { precision: 6, scale: 2 }),
    humidity: numeric("humidity", { precision: 6, scale: 2 }),
    power: numeric("power", { precision: 10, scale: 2 }),
    efficiency: numeric("efficiency", { precision: 5, scale: 2 }),
    speed: integer("speed"),
    pressure: numeric("pressure", { precision: 6, scale: 3 }),
    output: numeric("output", { precision: 10, scale: 2 }),
    runtime: integer("runtime"), // 运行时长（秒）
    raw_data: jsonb("raw_data"), // 原始数据
    recorded_at: timestamp("recorded_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("device_data_device_id_idx").on(table.device_id),
    index("device_data_recorded_at_idx").on(table.recorded_at),
  ]
);

// 告警表
export const alerts = pgTable(
  "alerts",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    device_id: varchar("device_id", { length: 36 }).notNull().references(() => devices.id),
    vendor_id: varchar("vendor_id", { length: 36 }).notNull().references(() => vendors.id),
    type: varchar("type", { length: 50 }).notNull(), // temperature, pressure, offline, fault
    level: varchar("level", { length: 20 }).notNull(), // info, warning, error, critical
    title: varchar("title", { length: 200 }).notNull(),
    message: text("message"),
    status: varchar("status", { length: 20 }).notNull().default('active'), // active, acknowledged, resolved
    acknowledged_by: varchar("acknowledged_by", { length: 36 }),
    acknowledged_at: timestamp("acknowledged_at", { withTimezone: true }),
    resolved_at: timestamp("resolved_at", { withTimezone: true }),
    value: numeric("value", { precision: 12, scale: 4 }), // 触发值
    threshold: numeric("threshold", { precision: 12, scale: 4 }), // 阈值
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("alerts_device_id_idx").on(table.device_id),
    index("alerts_vendor_id_idx").on(table.vendor_id),
    index("alerts_status_idx").on(table.status),
    index("alerts_level_idx").on(table.level),
    index("alerts_created_at_idx").on(table.created_at),
  ]
);

// 通知表
export const notifications = pgTable(
  "notifications",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    user_id: varchar("user_id", { length: 36 }).notNull(),
    type: varchar("type", { length: 50 }).notNull(), // alert, system, device
    title: varchar("title", { length: 200 }).notNull(),
    message: text("message"),
    data: jsonb("data"), // 附加数据
    is_read: boolean("is_read").default(false).notNull(),
    read_at: timestamp("read_at", { withTimezone: true }),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("notifications_user_id_idx").on(table.user_id),
    index("notifications_is_read_idx").on(table.is_read),
    index("notifications_created_at_idx").on(table.created_at),
  ]
);

// 生产报表表
export const productionReports = pgTable(
  "production_reports",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    device_id: varchar("device_id", { length: 36 }).notNull().references(() => devices.id),
    owner_id: varchar("owner_id", { length: 36 }).notNull(),
    date: timestamp("date", { withTimezone: true }).notNull(),
    total_output: numeric("total_output", { precision: 12, scale: 2 }).default('0'),
    total_runtime: integer("total_runtime").default(0), // 总运行时长（秒）
    avg_efficiency: numeric("avg_efficiency", { precision: 5, scale: 2 }),
    fault_count: integer("fault_count").default(0),
    fault_duration: integer("fault_duration").default(0), // 故障时长（秒）
    metadata: jsonb("metadata"),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("production_reports_device_id_idx").on(table.device_id),
    index("production_reports_owner_id_idx").on(table.owner_id),
    index("production_reports_date_idx").on(table.date),
  ]
);

// DTU配置表（用于设备通信）
export const dtuConfigs = pgTable(
  "dtu_configs",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    device_id: varchar("device_id", { length: 36 }).notNull().references(() => devices.id),
    dtu_sn: varchar("dtu_sn", { length: 100 }).notNull().unique(), // DTU序列号
    protocol: varchar("protocol", { length: 20 }).notNull().default('mqtt'), // mqtt, http, tcp
    endpoint: varchar("endpoint", { length: 255 }).notNull(), // 通信端点
    port: integer("port"),
    topic_subscribe: varchar("topic_subscribe", { length: 255 }), // 订阅主题
    topic_publish: varchar("topic_publish", { length: 255 }), // 发布主题
    username: varchar("username", { length: 100 }),
    password: varchar("password", { length: 100 }),
    interval_seconds: integer("interval_seconds").default(30), // 上报间隔
    is_active: boolean("is_active").default(true).notNull(),
    last_connected_at: timestamp("last_connected_at", { withTimezone: true }),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true }),
  },
  (table) => [
    index("dtu_configs_device_id_idx").on(table.device_id),
    index("dtu_configs_dtu_sn_idx").on(table.dtu_sn),
  ]
);

// 类型导出
export type UserProfile = typeof userProfiles.$inferSelect;
export type Vendor = typeof vendors.$inferSelect;
export type Device = typeof devices.$inferSelect;
export type DeviceData = typeof deviceData.$inferSelect;
export type Alert = typeof alerts.$inferSelect;
export type Notification = typeof notifications.$inferSelect;
export type ProductionReport = typeof productionReports.$inferSelect;
export type DtuConfig = typeof dtuConfigs.$inferSelect;
