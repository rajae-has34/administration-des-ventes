from rest_framework import serializers
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

class CarrierSerializer(serializers.ModelSerializer):
    class Meta:
        model = Carriers
        fields = '__all__'

class ContactSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(source='customer.name', read_only=True)
    
    class Meta:
        model = Contacts
        fields = '__all__'

class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customers
        fields = '__all__'

class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employees
        fields = '__all__'

class InteractionSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(source='customer.name', read_only=True)
    contact_name = serializers.CharField(source='contact.name', read_only=True)
    
    class Meta:
        model = Interactions
        fields = '__all__'

class InventoryMovementSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    from_location_code = serializers.CharField(source='from_location.location_code', read_only=True)
    to_location_code = serializers.CharField(source='to_location.location_code', read_only=True)
    
    class Meta:
        model = InventoryMovements
        fields = '__all__'

class InvoiceSerializer(serializers.ModelSerializer):
    order_id_display = serializers.CharField(source='order.order_id', read_only=True)
    customer_name = serializers.CharField(source='order.customer.name', read_only=True)
    
    class Meta:
        model = Invoices
        fields = '__all__'

class KpiSerializer(serializers.ModelSerializer):
    class Meta:
        model = Kpis
        fields = '__all__'

class KpiMeasurementSerializer(serializers.ModelSerializer):
    kpi_name = serializers.CharField(source='kpi.name', read_only=True)
    
    class Meta:
        model = KpiMeasurements
        fields = '__all__'

class LocationSerializer(serializers.ModelSerializer):
    warehouse_name = serializers.CharField(source='warehouse.name', read_only=True)
    
    class Meta:
        model = Locations
        fields = '__all__'

class OperationSerializer(serializers.ModelSerializer):
    work_order_id_display = serializers.CharField(source='work_order.work_order_id', read_only=True)
    line_name = serializers.CharField(source='line.name', read_only=True)
    
    class Meta:
        model = Operations
        fields = '__all__'

class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    total_price = serializers.SerializerMethodField()

    class Meta:
        model = OrderItems
        fields = '__all__'

    def get_total_price(self, obj):
        return obj.quantity * obj.unit_price

class PaymentSerializer(serializers.ModelSerializer):
    invoice_id_display = serializers.CharField(source='invoice.invoice_id', read_only=True)
    
    class Meta:
        model = Payments
        fields = '__all__'

class PayrollSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source='employee.first_name', read_only=True)
    
    class Meta:
        model = Payroll
        fields = '__all__'

class PlanItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    plan_name = serializers.CharField(source='plan.name', read_only=True)
    
    class Meta:
        model = PlanItems
        fields = '__all__'

class PoItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    total_price = serializers.SerializerMethodField()

    class Meta:
        model = PoItems
        fields = '__all__'

    def get_total_price(self, obj):
        return obj.quantity * obj.unit_price

class ProductionLineSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductionLines
        fields = '__all__'

class ProductionPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductionPlans
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Products
        fields = '__all__'

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Projects
        fields = '__all__'

class PurchaseOrderSerializer(serializers.ModelSerializer):
    supplier_name = serializers.CharField(source='supplier.name', read_only=True)
    
    class Meta:
        model = PurchaseOrders
        fields = '__all__'

class QualityCheckSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    work_order_id_display = serializers.CharField(source='work_order.work_order_id', read_only=True)
    
    class Meta:
        model = QualityChecks
        fields = '__all__'

class SalesOrderSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(source='customer.name', read_only=True)
    
    class Meta:
        model = SalesOrders
        fields = '__all__'

class ShipmentSerializer(serializers.ModelSerializer):
    order_id_display = serializers.CharField(source='order.order_id', read_only=True)
    carrier_name = serializers.CharField(source='carrier.name', read_only=True)
    
    class Meta:
        model = Shipments
        fields = '__all__'

class SpcMeasurementSerializer(serializers.ModelSerializer):
    check_id_display = serializers.CharField(source='quality_check.check_id', read_only=True)  # Modifié
    
    class Meta:
        model = SpcMeasurements
        fields = '__all__'

class StockLevelSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    warehouse_name = serializers.CharField(source='warehouse.name', read_only=True)

    class Meta:
        model = StockLevels
        fields = '__all__'

class SupplierSerializer(serializers.ModelSerializer):
    class Meta:
        model = Suppliers
        fields = '__all__'

class SupportTicketSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(source='customer.name', read_only=True)
    
    class Meta:
        model = SupportTickets
        fields = '__all__'

class TaskSerializer(serializers.ModelSerializer):
    project_name = serializers.CharField(source='project.name', read_only=True)
    
    class Meta:
        model = Tasks
        fields = '__all__'

class TicketResponseSerializer(serializers.ModelSerializer):
    ticket_subject = serializers.CharField(source='ticket.subject', read_only=True)
    employee_name = serializers.CharField(source='employee.first_name', read_only=True)
    
    class Meta:
        model = TicketResponses
        fields = '__all__'

class WarehouseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Warehouses
        fields = '__all__'

class WorkOrderSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    
    class Meta:
        model = WorkOrders
        fields = '__all__'
