import frappe
from frappe import _

@frappe.whitelist()
def save_tariff():
    """
    Save tariff configuration for a specific consumer type.
    Expects parameters via frappe.form_dict.
    """
    consumer_type = frappe.form_dict.get("consumer_type")
    fixed_charge_enabled = frappe.form_dict.get("fixed_charge_enabled")
    direct_computation_enabled = frappe.form_dict.get("direct_computation_enabled")
    fixed_charge = frappe.form_dict.get("fixed_charge")
    overdue_fine = frappe.form_dict.get("over_due_fine")
    tariff_rows = frappe.form_dict.get("tariff_rows")
    
    try:
        # Convert string parameters to appropriate types
        fixed_charge_enabled = frappe.parse_json(fixed_charge_enabled)
        direct_computation_enabled = frappe.parse_json(direct_computation_enabled)
        fixed_charge = float(fixed_charge or 0)
        overdue_fine = float(overdue_fine or 0)
        tariff_rows = frappe.parse_json(tariff_rows)
        
        # Check if a Tariff doc exists for this consumer type
        existing_tariff = frappe.get_all(
            "Consumer Type",
            filters={"consumer_type": consumer_type},
            limit=1
        )
        
        if existing_tariff:
            doc = frappe.get_doc("Consumer Type", existing_tariff[0].name)
            doc.is_fixed_charge = fixed_charge_enabled
            doc.is_direct_computation = direct_computation_enabled
            doc.fixed_charge = fixed_charge
            doc.over_due_fine = overdue_fine
            # Clear existing tariff rows
            doc.tariff_rows = []
        else:
            doc = frappe.new_doc("Consumer Type")
            doc.consumer_type = consumer_type
            doc.is_fixed_charge = fixed_charge_enabled
            doc.is_direct_computation = direct_computation_enabled
            doc.fixed_charge = fixed_charge
            doc.over_due_fine = overdue_fine
            
        # Append each tariff row
        for row in tariff_rows:
            doc.append("tariff_rows", {
                "from_unit": float(row.get("fromUnit")),
                "to_unit": float(row.get("toUnit")),
                "tariff": float(row.get("tariff")),
                "per_unit": float(row.get("perUnit")),
                "basic_amount": float(row.get("basicAmount")),
                "total_amount": float(row.get("totalAmount"))
            })
            
        doc.save()
        frappe.db.commit()
        
        return {
            "status": "success",
            "message": _("Tariff data saved successfully")
        }
        
    except Exception as e:
        frappe.log_error(f"Error saving tariff data: {str(e)}")
        return {
            "status": "error",
            "message": _("Error saving tariff data: {0}").format(str(e))
        }
    
    
@frappe.whitelist()
def get_tariff():
    """
    Fetch tariff configuration for a specific consumer type.
    Expects the 'consumer_type' parameter via frappe.form_dict.
    """
    consumer_type = frappe.form_dict.get("consumer_type")
    try:
        tariff_doc = frappe.get_all(
            "Consumer Type",
            filters={"consumer_type": consumer_type},
            fields=["name", "is_fixed_charge", "is_direct_computation", 
                    "fixed_charge", "over_due_fine"],
            limit=1
        )
        
        if not tariff_doc:
            return {
                "status": "success",
                "data": None
            }
            
        doc = frappe.get_doc("Consumer Type", tariff_doc[0].name)
        
        tariff_rows = []
        for row in doc.tariff_rows:
            tariff_rows.append({
                "fromUnit": row.from_unit,
                "toUnit": row.to_unit,
                "tariff": row.tariff,
                "perUnit": row.per_unit,
                "basicAmount": row.basic_amount,
                "totalAmount": row.total_amount
            })
            
        return {
            "status": "success",
            "data": {
                "fixed_charge_check": doc.is_fixed_charge,
                "direct_computation_check": doc.is_direct_computation,
                "fixed_charge": doc.fixed_charge,
                "overdue_fine": doc.over_due_fine,
                "tariff_rows": tariff_rows
            }
        }
        
    except Exception as e:
        frappe.log_error(f"Error fetching tariff data: {str(e)}")
        return {
            "status": "error",
            "message": _("Error fetching tariff data: {0}").format(str(e))
        }
