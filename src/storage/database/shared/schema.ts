import { pgTable, serial, timestamp, index, foreignKey, varchar, text, numeric, bigint, integer, jsonb, unique, boolean, uuid } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

// 生成随机UUID的函数
const gen_random_uuid = () => sql`gen_random_uuid()`;



export const healthCheck = pgTable("health_check", {
	id: serial().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
});

export const alerts = pgTable("alerts", {
	id: varchar({ length: 36 }).default(gen_random_uuid()).primaryKey().notNull(),
	deviceId: varchar("device_id", { length: 36 }).notNull(),
	vendorId: varchar("vendor_id", { length: 36 }).notNull(),
	type: varchar({ length: 50 }).notNull(),
	level: varchar({ length: 20 }).notNull(),
	title: varchar({ length: 200 }).notNull(),
	message: text(),
	status: varchar({ length: 20 }).default('active').notNull(),
	acknowledgedBy: varchar("acknowledged_by", { length: 36 }),
	acknowledgedAt: timestamp("acknowledged_at", { withTimezone: true, mode: 'string' }),
	resolvedAt: timestamp("resolved_at", { withTimezone: true, mode: 'string' }),
	value: numeric({ precision: 12, scale:  4 }),
	threshold: numeric({ precision: 12, scale:  4 }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("alerts_created_at_idx").using("btree", table.createdAt.asc().nullsLast().op("timestamptz_ops")),
	index("alerts_device_id_idx").using("btree", table.deviceId.asc().nullsLast().op("text_ops")),
	index("alerts_level_idx").using("btree", table.level.asc().nullsLast().op("text_ops")),
	index("alerts_status_idx").using("btree", table.status.asc().nullsLast().op("text_ops")),
	index("alerts_vendor_id_idx").using("btree", table.vendorId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.deviceId],
			foreignColumns: [devices.id],
			name: "alerts_device_id_devices_id_fk"
		}),
	foreignKey({
			columns: [table.vendorId],
			foreignColumns: [vendors.id],
			name: "alerts_vendor_id_vendors_id_fk"
		}),
]);

export const deviceData = pgTable("device_data", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity(),
	deviceId: varchar("device_id", { length: 36 }).notNull(),
	temperature: numeric({ precision: 6, scale:  2 }),
	humidity: numeric({ precision: 6, scale:  2 }),
	power: numeric({ precision: 10, scale:  2 }),
	efficiency: numeric({ precision: 5, scale:  2 }),
	speed: integer(),
	pressure: numeric({ precision: 6, scale:  3 }),
	output: numeric({ precision: 10, scale:  2 }),
	runtime: integer(),
	rawData: jsonb("raw_data"),
	recordedAt: timestamp("recorded_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("device_data_device_id_idx").using("btree", table.deviceId.asc().nullsLast().op("text_ops")),
	index("device_data_recorded_at_idx").using("btree", table.recordedAt.asc().nullsLast().op("timestamptz_ops")),
	foreignKey({
			columns: [table.deviceId],
			foreignColumns: [devices.id],
			name: "device_data_device_id_devices_id_fk"
		}),
]);

export const dtuConfigs = pgTable("dtu_configs", {
	id: varchar({ length: 36 }).default(gen_random_uuid()).primaryKey().notNull(),
	deviceId: varchar("device_id", { length: 36 }).notNull(),
	dtuSn: varchar("dtu_sn", { length: 100 }).notNull(),
	protocol: varchar({ length: 20 }).default('mqtt').notNull(),
	endpoint: varchar({ length: 255 }).notNull(),
	port: integer(),
	topicSubscribe: varchar("topic_subscribe", { length: 255 }),
	topicPublish: varchar("topic_publish", { length: 255 }),
	username: varchar({ length: 100 }),
	password: varchar({ length: 100 }),
	intervalSeconds: integer("interval_seconds").default(30),
	isActive: boolean("is_active").default(true).notNull(),
	lastConnectedAt: timestamp("last_connected_at", { withTimezone: true, mode: 'string' }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	index("dtu_configs_device_id_idx").using("btree", table.deviceId.asc().nullsLast().op("text_ops")),
	index("dtu_configs_dtu_sn_idx").using("btree", table.dtuSn.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.deviceId],
			foreignColumns: [devices.id],
			name: "dtu_configs_device_id_devices_id_fk"
		}),
	unique("dtu_configs_dtu_sn_unique").on(table.dtuSn),
]);

export const devices = pgTable("devices", {
	id: varchar({ length: 36 }).default(gen_random_uuid()).primaryKey().notNull(),
	name: varchar({ length: 128 }).notNull(),
	serialNumber: varchar("serial_number", { length: 100 }).notNull(),
	vendorId: varchar("vendor_id", { length: 36 }).notNull(),
	ownerId: varchar("owner_id", { length: 36 }),
	deviceType: varchar("device_type", { length: 50 }).notNull(),
	model: varchar({ length: 100 }),
	status: varchar({ length: 20 }).default('offline').notNull(),
	location: varchar({ length: 200 }),
	latitude: numeric({ precision: 10, scale:  6 }),
	longitude: numeric({ precision: 10, scale:  6 }),
	installDate: timestamp("install_date", { withTimezone: true, mode: 'string' }),
	lastHeartbeatAt: timestamp("last_heartbeat_at", { withTimezone: true, mode: 'string' }),
	metadata: jsonb(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
	templateId: varchar("template_id", { length: 36 }),
}, (table) => [
	index("devices_owner_id_idx").using("btree", table.ownerId.asc().nullsLast().op("text_ops")),
	index("devices_serial_number_idx").using("btree", table.serialNumber.asc().nullsLast().op("text_ops")),
	index("devices_status_idx").using("btree", table.status.asc().nullsLast().op("text_ops")),
	index("devices_template_id_idx").using("btree", table.templateId.asc().nullsLast().op("text_ops")),
	index("devices_vendor_id_idx").using("btree", table.vendorId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.vendorId],
			foreignColumns: [vendors.id],
			name: "devices_vendor_id_vendors_id_fk"
		}),
	foreignKey({
			columns: [table.templateId],
			foreignColumns: [deviceTemplates.id],
			name: "devices_template_id_device_templates_id_fk"
		}),
	unique("devices_serial_number_unique").on(table.serialNumber),
]);

export const vendors = pgTable("vendors", {
	id: varchar({ length: 36 }).default(gen_random_uuid()).primaryKey().notNull(),
	name: varchar({ length: 128 }).notNull(),
	code: varchar({ length: 50 }).notNull(),
	contactName: varchar("contact_name", { length: 128 }),
	contactPhone: varchar("contact_phone", { length: 20 }),
	contactEmail: varchar("contact_email", { length: 255 }),
	address: text(),
	status: varchar({ length: 20 }).default('pending').notNull(),
	deviceCount: integer("device_count").default(0),
	customerCount: integer("customer_count").default(0),
	monthlyRevenue: numeric("monthly_revenue", { precision: 12, scale:  2 }).default('0'),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
	expiresAt: timestamp("expires_at", { withTimezone: true, mode: 'string' }),
	createdBy: uuid("created_by"),
}, (table) => [
	index("vendors_code_idx").using("btree", table.code.asc().nullsLast().op("text_ops")),
	index("vendors_status_idx").using("btree", table.status.asc().nullsLast().op("text_ops")),
	unique("vendors_code_unique").on(table.code),
]);

export const userProfiles = pgTable("user_profiles", {
	id: varchar({ length: 36 }).primaryKey().notNull(),
	email: varchar({ length: 255 }).notNull(),
	name: varchar({ length: 128 }).notNull(),
	phone: varchar({ length: 20 }),
	avatarUrl: varchar("avatar_url", { length: 500 }),
	role: varchar({ length: 20 }).default('user').notNull(),
	vendorId: varchar("vendor_id", { length: 36 }),
	isActive: boolean("is_active").default(true).notNull(),
	lastLoginAt: timestamp("last_login_at", { withTimezone: true, mode: 'string' }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
	expiresAt: timestamp("expires_at", { withTimezone: true, mode: 'string' }),
	createdBy: uuid("created_by"),
}, (table) => [
	index("user_profiles_email_idx").using("btree", table.email.asc().nullsLast().op("text_ops")),
	index("user_profiles_role_idx").using("btree", table.role.asc().nullsLast().op("text_ops")),
	index("user_profiles_vendor_id_idx").using("btree", table.vendorId.asc().nullsLast().op("text_ops")),
]);

export const deviceTemplates = pgTable("device_templates", {
	id: varchar({ length: 36 }).default(gen_random_uuid()).primaryKey().notNull(),
	name: varchar({ length: 128 }).notNull(),
	code: varchar({ length: 50 }).notNull(),
	category: varchar({ length: 50 }).notNull(),
	description: text(),
	icon: varchar({ length: 100 }),
	imageUrl: varchar("image_url", { length: 500 }),
	dashboardConfig: jsonb("dashboard_config").notNull(),
	detailConfig: jsonb("detail_config").notNull(),
	alertRules: jsonb("alert_rules"),
	isActive: boolean("is_active").default(true).notNull(),
	createdBy: varchar("created_by", { length: 36 }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	index("device_templates_category_idx").using("btree", table.category.asc().nullsLast().op("text_ops")),
	index("device_templates_code_idx").using("btree", table.code.asc().nullsLast().op("text_ops")),
	unique("device_templates_code_unique").on(table.code),
]);

export const templatePermissions = pgTable("template_permissions", {
	id: varchar({ length: 36 }).default(gen_random_uuid()).primaryKey().notNull(),
	templateId: varchar("template_id", { length: 36 }).notNull(),
	vendorId: varchar("vendor_id", { length: 36 }).notNull(),
	canView: boolean("can_view").default(true).notNull(),
	canCreate: boolean("can_create").default(true).notNull(),
	canEdit: boolean("can_edit").default(false).notNull(),
	customConfig: jsonb("custom_config"),
	isActive: boolean("is_active").default(true).notNull(),
	grantedBy: varchar("granted_by", { length: 36 }),
	grantedAt: timestamp("granted_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("template_permissions_template_id_idx").using("btree", table.templateId.asc().nullsLast().op("text_ops")),
	index("template_permissions_vendor_id_idx").using("btree", table.vendorId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.templateId],
			foreignColumns: [deviceTemplates.id],
			name: "template_permissions_template_id_device_templates_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.vendorId],
			foreignColumns: [vendors.id],
			name: "template_permissions_vendor_id_vendors_id_fk"
		}).onDelete("cascade"),
]);

export const templateFields = pgTable("template_fields", {
	id: varchar({ length: 36 }).default(gen_random_uuid()).primaryKey().notNull(),
	templateId: varchar("template_id", { length: 36 }).notNull(),
	fieldKey: varchar("field_key", { length: 100 }).notNull(),
	fieldName: varchar("field_name", { length: 128 }).notNull(),
	fieldType: varchar("field_type", { length: 30 }).notNull(),
	unit: varchar({ length: 20 }),
	minValue: numeric("min_value", { precision: 12, scale:  4 }),
	maxValue: numeric("max_value", { precision: 12, scale:  4 }),
	defaultValue: varchar("default_value", { length: 255 }),
	enumOptions: jsonb("enum_options"),
	icon: varchar({ length: 50 }),
	color: varchar({ length: 20 }),
	showInList: boolean("show_in_list").default(false).notNull(),
	showInDashboard: boolean("show_in_dashboard").default(true).notNull(),
	showInDetail: boolean("show_in_detail").default(true).notNull(),
	chartType: varchar("chart_type", { length: 20 }),
	alertMin: numeric("alert_min", { precision: 12, scale:  4 }),
	alertMax: numeric("alert_max", { precision: 12, scale:  4 }),
	warningMin: numeric("warning_min", { precision: 12, scale:  4 }),
	warningMax: numeric("warning_max", { precision: 12, scale:  4 }),
	sortOrder: integer("sort_order").default(0),
	groupName: varchar("group_name", { length: 50 }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	cardWidth: varchar("card_width", { length: 10 }).default('half'),
}, (table) => [
	index("template_fields_template_id_idx").using("btree", table.templateId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.templateId],
			foreignColumns: [deviceTemplates.id],
			name: "template_fields_template_id_device_templates_id_fk"
		}).onDelete("cascade"),
]);

export const notifications = pgTable("notifications", {
	id: varchar({ length: 36 }).default(gen_random_uuid()).primaryKey().notNull(),
	userId: varchar("user_id", { length: 36 }).notNull(),
	type: varchar({ length: 50 }).notNull(),
	title: varchar({ length: 200 }).notNull(),
	message: text(),
	data: jsonb(),
	isRead: boolean("is_read").default(false).notNull(),
	readAt: timestamp("read_at", { withTimezone: true, mode: 'string' }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("notifications_created_at_idx").using("btree", table.createdAt.asc().nullsLast().op("timestamptz_ops")),
	index("notifications_is_read_idx").using("btree", table.isRead.asc().nullsLast().op("bool_ops")),
	index("notifications_user_id_idx").using("btree", table.userId.asc().nullsLast().op("text_ops")),
]);

export const productionReports = pgTable("production_reports", {
	id: varchar({ length: 36 }).default(gen_random_uuid()).primaryKey().notNull(),
	deviceId: varchar("device_id", { length: 36 }).notNull(),
	ownerId: varchar("owner_id", { length: 36 }).notNull(),
	date: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
	totalOutput: numeric("total_output", { precision: 12, scale:  2 }).default('0'),
	totalRuntime: integer("total_runtime").default(0),
	avgEfficiency: numeric("avg_efficiency", { precision: 5, scale:  2 }),
	faultCount: integer("fault_count").default(0),
	faultDuration: integer("fault_duration").default(0),
	metadata: jsonb(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("production_reports_date_idx").using("btree", table.date.asc().nullsLast().op("timestamptz_ops")),
	index("production_reports_device_id_idx").using("btree", table.deviceId.asc().nullsLast().op("text_ops")),
	index("production_reports_owner_id_idx").using("btree", table.ownerId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.deviceId],
			foreignColumns: [devices.id],
			name: "production_reports_device_id_devices_id_fk"
		}),
]);
