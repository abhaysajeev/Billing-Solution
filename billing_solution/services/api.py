import frappe
from frappe import _
import billing_solution.services as services 


@frappe.whitelist()
def save_tariff():
    consumer_type = frappe.form_dict.get("consumer_type")
    fixed_charge_enabled = frappe.form_dict.get("fixed_charge_enabled")
    direct_computation_enabled = frappe.form_dict.get("direct_computation_enabled")
    fixed_charge = frappe.form_dict.get("fixed_charge")
    overdue_fine = frappe.form_dict.get("overdue_fine")
    tariff_rows = frappe.form_dict.get("tariff_rows")
    
    return services.tariff_api.save_tariff_data(
        consumer_type, fixed_charge_enabled, direct_computation_enabled,
        fixed_charge, overdue_fine, tariff_rows
    )

@frappe.whitelist()
def get_tariff():
    consumer_type = frappe.form_dict.get("consumer_type")
    return services.tariff_api.get_tariff_data(consumer_type)