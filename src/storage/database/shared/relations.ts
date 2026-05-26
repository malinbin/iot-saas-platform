import { relations } from "drizzle-orm/relations";
import { devices, alerts, vendors, deviceData, dtuConfigs, deviceTemplates, templatePermissions, templateFields, productionReports } from "./schema";

export const alertsRelations = relations(alerts, ({one}) => ({
	device: one(devices, {
		fields: [alerts.deviceId],
		references: [devices.id]
	}),
	vendor: one(vendors, {
		fields: [alerts.vendorId],
		references: [vendors.id]
	}),
}));

export const devicesRelations = relations(devices, ({one, many}) => ({
	alerts: many(alerts),
	deviceData: many(deviceData),
	dtuConfigs: many(dtuConfigs),
	vendor: one(vendors, {
		fields: [devices.vendorId],
		references: [vendors.id]
	}),
	deviceTemplate: one(deviceTemplates, {
		fields: [devices.templateId],
		references: [deviceTemplates.id]
	}),
	productionReports: many(productionReports),
}));

export const vendorsRelations = relations(vendors, ({many}) => ({
	alerts: many(alerts),
	devices: many(devices),
	templatePermissions: many(templatePermissions),
}));

export const deviceDataRelations = relations(deviceData, ({one}) => ({
	device: one(devices, {
		fields: [deviceData.deviceId],
		references: [devices.id]
	}),
}));

export const dtuConfigsRelations = relations(dtuConfigs, ({one}) => ({
	device: one(devices, {
		fields: [dtuConfigs.deviceId],
		references: [devices.id]
	}),
}));

export const deviceTemplatesRelations = relations(deviceTemplates, ({many}) => ({
	devices: many(devices),
	templatePermissions: many(templatePermissions),
	templateFields: many(templateFields),
}));

export const templatePermissionsRelations = relations(templatePermissions, ({one}) => ({
	deviceTemplate: one(deviceTemplates, {
		fields: [templatePermissions.templateId],
		references: [deviceTemplates.id]
	}),
	vendor: one(vendors, {
		fields: [templatePermissions.vendorId],
		references: [vendors.id]
	}),
}));

export const templateFieldsRelations = relations(templateFields, ({one}) => ({
	deviceTemplate: one(deviceTemplates, {
		fields: [templateFields.templateId],
		references: [deviceTemplates.id]
	}),
}));

export const productionReportsRelations = relations(productionReports, ({one}) => ({
	device: one(devices, {
		fields: [productionReports.deviceId],
		references: [devices.id]
	}),
}));