import frappe
from frappe import _

def get_context(context):
    try:
        context.update({
            'no_cache': 1,
            'show_navbar': True,
            'navbar_template': 'templates/includes/navbar.html'
        })
    except Exception as e:
        print(f"Error: {e}")
    return context