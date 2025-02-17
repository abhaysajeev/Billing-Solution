
import frappe
from frappe import _

@frappe.whitelist(allow_guest=True)
def get_consumer_type_values():
    try:
        # Fetch all values of the 'consumer_type' field from the 'Consumer Type' table
        consumer_type_values = frappe.get_all('Consumer Type', fields=['consumer_type'])

        # Check if data was retrieved
        if not consumer_type_values:
            raise ValueError(_("No data found for consumer_type."))

        # Extracting the values of the 'consumer_type' field from the result
        consumer_type_list = [row['consumer_type'] for row in consumer_type_values]

        return consumer_type_list

    except frappe.exceptions.DoesNotExistError:
        # Handle case when the 'Consumer Type' doctype does not exist
        frappe.log_error(message="Consumer Type doctype does not exist", title="Doctype Error")
        return {"error": _("Consumer Type doctype does not exist.")}

    except Exception as e:
        # Handle other general exceptions
        frappe.log_error(message=str(e), title="Unknown Error")
        return {"error": _("An unknown error occurred: ") + str(e)}


