import frappe
from frappe import _

def get_context(context):
    if frappe.session.user != "Guest":
        # If user is already logged in, just return without doing anything
        return
        
    context.no_cache = 1
    context.title = _("Login")