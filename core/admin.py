from django.contrib import admin
from .models.carriers import Carriers
from .models.contacts import Contacts
from .models.customers import Customers
from .models.employees import Employees
from .models.interactions import Interactions
from .models.inventory_movements import InventoryMovements
from .models.invoices import Invoices
from .models.kpis import Kpis
from .models.kpi_measurements import KpiMeasurements
from .models.locations import Locations
from .models.operations import Operations
from .models.order_items import OrderItems
from .models.payments import Payments
from .models.payroll import Payroll
from .models.plan_items import PlanItems
from .models.po_items import PoItems
from .models.production_lines import ProductionLines
from .models.production_plans import ProductionPlans
from .models.products import Products
from .models.projects import Projects
from .models.purchase_orders import PurchaseOrders
from .models.quality_checks import QualityChecks
from .models.sales_orders import SalesOrders
from .models.shipments import Shipments
from .models.spc_measurements import SpcMeasurements
from .models.stock_levels import StockLevels
from .models.suppliers import Suppliers
from .models.support_tickets import SupportTickets
from .models.tasks import Tasks
from .models.ticket_responses import TicketResponses
from .models.warehouses import Warehouses
from .models.work_orders import WorkOrders

@admin.register(Carriers)
class CarrierAdmin(admin.ModelAdmin):
    list_display = ['name', 'contact_info', 'created_at']
    search_fields = ['name']

@admin.register(Contacts)
class ContactAdmin(admin.ModelAdmin):
    list_display = ['name', 'customer', 'email', 'role', 'created_at']
    search_fields = ['name', 'email', 'customer__name']
    list_filter = ['role']

@admin.register(Customers)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'phone', 'created_at']
    search_fields = ['name', 'email']

@admin.register(Employees)
class EmployeeAdmin(admin.ModelAdmin):
    list_display = ['first_name', 'last_name', 'email', 'department', 'hire_date']
    search_fields = ['first_name', 'last_name', 'email']
    list_filter = ['department']

@admin.register(Interactions)
class InteractionAdmin(admin.ModelAdmin):
    list_display = ['customer', 'contact', 'interaction_date', 'type']
    list_filter = ['type', 'interaction_date']
    search_fields = ['customer__name', 'contact__name']

@admin.register(InventoryMovements)
class InventoryMovementAdmin(admin.ModelAdmin):
    list_display = ['product', 'from_location', 'to_location', 'quantity', 'movement_date']
    list_filter = ['movement_date']

@admin.register(Invoices)
class InvoiceAdmin(admin.ModelAdmin):
    list_display = ['invoice_id', 'order', 'invoice_date', 'amount', 'status']
    list_filter = ['status', 'invoice_date']

@admin.register(Kpis)
class KpiAdmin(admin.ModelAdmin):
    list_display = ['name', 'target_value', 'unit']
    search_fields = ['name']

@admin.register(KpiMeasurements)
class KpiMeasurementAdmin(admin.ModelAdmin):
    list_display = ['kpi', 'measurement_date', 'actual_value']
    list_filter = ['measurement_date']

@admin.register(Locations)
class LocationAdmin(admin.ModelAdmin):
    list_display = ['location_code', 'warehouse']
    search_fields = ['location_code']

@admin.register(Operations)
class OperationAdmin(admin.ModelAdmin):
    list_display = ['operation_name', 'work_order', 'line', 'status', 'start_time']
    list_filter = ['status']

@admin.register(OrderItems)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ['order', 'product', 'quantity', 'unit_price']
    search_fields = ['product__name']

@admin.register(Payments)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ['invoice', 'payment_date', 'amount', 'method']
    list_filter = ['method', 'payment_date']

@admin.register(Payroll)
class PayrollAdmin(admin.ModelAdmin):
    list_display = ['employee', 'pay_period_start', 'pay_period_end', 'gross_pay', 'net_pay']
    list_filter = ['pay_period_start']

@admin.register(PlanItems)
class PlanItemAdmin(admin.ModelAdmin):
    list_display = ['plan', 'product', 'quantity', 'due_date']
    list_filter = ['due_date']

@admin.register(PoItems)
class PoItemAdmin(admin.ModelAdmin):
    list_display = ['po', 'product', 'quantity', 'unit_price']
    search_fields = ['product__name']

@admin.register(ProductionLines)
class ProductionLineAdmin(admin.ModelAdmin):
    list_display = ['name', 'location']
    search_fields = ['name']

@admin.register(ProductionPlans)
class ProductionPlanAdmin(admin.ModelAdmin):
    list_display = ['name', 'start_date', 'end_date', 'created_at']
    list_filter = ['start_date', 'end_date']

@admin.register(Products)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'sku', 'unit_price', 'reorder_level', 'created_at']
    search_fields = ['name', 'sku']
    list_filter = ['created_at']

@admin.register(Projects)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ['name', 'start_date', 'end_date', 'status']
    list_filter = ['status', 'start_date']
    search_fields = ['name']

@admin.register(PurchaseOrders)
class PurchaseOrderAdmin(admin.ModelAdmin):
    list_display = ['po_id', 'supplier', 'order_date', 'status', 'total_amount']
    list_filter = ['status', 'order_date']

@admin.register(QualityChecks)
class QualityCheckAdmin(admin.ModelAdmin):
    list_display = ['product', 'work_order', 'check_date', 'result']
    list_filter = ['result', 'check_date']

@admin.register(SalesOrders)
class SalesOrderAdmin(admin.ModelAdmin):
    list_display = ['order_id', 'customer', 'order_date', 'status', 'total_amount']
    list_filter = ['status', 'order_date']
    search_fields = ['customer__name']

@admin.register(Shipments)
class ShipmentAdmin(admin.ModelAdmin):
    list_display = ['shipment_id', 'order', 'carrier', 'tracking_number', 'status']
    list_filter = ['status', 'shipment_date']

@admin.register(SpcMeasurements)
class SpcMeasurementAdmin(admin.ModelAdmin):
    list_display = ['quality_check', 'parameter_name', 'value']  # Modifié
    search_fields = ['parameter_name']
@admin.register(StockLevels)
class StockLevelAdmin(admin.ModelAdmin):
    list_display = ['product', 'warehouse', 'quantity', 'last_updated']
    list_filter = ['warehouse']
    search_fields = ['product__name']

@admin.register(Suppliers)
class SupplierAdmin(admin.ModelAdmin):
    list_display = ['name', 'contact_info', 'created_at']
    search_fields = ['name']

@admin.register(SupportTickets)
class SupportTicketAdmin(admin.ModelAdmin):
    list_display = ['ticket_id', 'customer', 'subject', 'status', 'priority', 'created_at']
    list_filter = ['status', 'priority', 'created_at']
    search_fields = ['subject', 'customer__name']

@admin.register(Tasks)
class TaskAdmin(admin.ModelAdmin):
    list_display = ['name', 'project', 'due_date', 'status']
    list_filter = ['status', 'due_date']
    search_fields = ['name']

@admin.register(TicketResponses)
class TicketResponseAdmin(admin.ModelAdmin):
    list_display = ['ticket', 'employee', 'created_at']
    list_filter = ['created_at']

@admin.register(Warehouses)
class WarehouseAdmin(admin.ModelAdmin):
    list_display = ['name', 'location', 'created_at']
    search_fields = ['name']

@admin.register(WorkOrders)
class WorkOrderAdmin(admin.ModelAdmin):
    list_display = ['work_order_id', 'product', 'quantity', 'status', 'start_date']
    list_filter = ['status', 'start_date']