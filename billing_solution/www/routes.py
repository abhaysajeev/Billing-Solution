# In routes.py
import frappe
from frappe import _

@frappe.route('/custom_logout')
def custom_logout():
    try:
        # Call JWT logout method
        jwt_logout = frappe.get_attr('jwt_auth.jwt_auth.doctype.jwt_auth.jwt_auth.logout')
        jwt_logout()
        
        # Clear session and redirect
        frappe.local.login_manager.logout()
        frappe.clear_cache(user=frappe.session.user)
        return frappe.redirect('/login')
    
    except Exception as e:
        frappe.log_error(f"Logout Error: {str(e)}")
        return frappe.redirect('/login')