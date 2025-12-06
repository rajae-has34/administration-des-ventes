from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
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
from .serializers import *

class CarrierViewSet(viewsets.ModelViewSet):
    queryset = Carriers.objects.all().order_by('-created_at')
    serializer_class = CarrierSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    search_fields = ['name', 'contact_info']

class ContactViewSet(viewsets.ModelViewSet):
    queryset = Contacts.objects.all().order_by('-created_at')
    serializer_class = ContactSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    search_fields = ['name', 'email', 'role', 'customer__name']
    filterset_fields = ['customer']

class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customers.objects.all().order_by('-created_at')
    serializer_class = CustomerSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    search_fields = ['name', 'email', 'phone']
    filterset_fields = ['name']

class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employees.objects.all().order_by('-hire_date')
    serializer_class = EmployeeSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    search_fields = ['first_name', 'last_name', 'email', 'department']

class InteractionViewSet(viewsets.ModelViewSet):
    queryset = Interactions.objects.all().order_by('-interaction_date')
    serializer_class = InteractionSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    search_fields = ['customer__name', 'type', 'notes']
    filterset_fields = ['customer', 'type']

class InventoryMovementViewSet(viewsets.ModelViewSet):
    queryset = InventoryMovements.objects.all().order_by('-movement_date')
    serializer_class = InventoryMovementSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['product', 'from_location', 'to_location']

class InvoiceViewSet(viewsets.ModelViewSet):
    queryset = Invoices.objects.all().order_by('-invoice_date')
    serializer_class = InvoiceSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    search_fields = ['order__customer__name', 'status']
    filterset_fields = ['status', 'order']

class KpiViewSet(viewsets.ModelViewSet):
    queryset = Kpis.objects.all().order_by('name')
    serializer_class = KpiSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'description']

class KpiMeasurementViewSet(viewsets.ModelViewSet):
    queryset = KpiMeasurements.objects.all().order_by('-measurement_date')
    serializer_class = KpiMeasurementSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['kpi']

class LocationViewSet(viewsets.ModelViewSet):
    queryset = Locations.objects.all().order_by('location_code')
    serializer_class = LocationSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    search_fields = ['location_code', 'warehouse__name']
    filterset_fields = ['warehouse']

class OperationViewSet(viewsets.ModelViewSet):
    queryset = Operations.objects.all().order_by('-start_time')
    serializer_class = OperationSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    search_fields = ['operation_name', 'work_order__work_order_id']
    filterset_fields = ['status', 'line']

class OrderItemViewSet(viewsets.ModelViewSet):
    queryset = OrderItems.objects.all()
    serializer_class = OrderItemSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['order', 'product']

class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payments.objects.all().order_by('-payment_date')
    serializer_class = PaymentSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['invoice']

class PayrollViewSet(viewsets.ModelViewSet):
    queryset = Payroll.objects.all().order_by('-payment_date')
    serializer_class = PayrollSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['employee']

class PlanItemViewSet(viewsets.ModelViewSet):
    queryset = PlanItems.objects.all().order_by('due_date')
    serializer_class = PlanItemSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['plan', 'product']

class PoItemViewSet(viewsets.ModelViewSet):
    queryset = PoItems.objects.all()
    serializer_class = PoItemSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['po', 'product']

class ProductionLineViewSet(viewsets.ModelViewSet):
    queryset = ProductionLines.objects.all().order_by('name')
    serializer_class = ProductionLineSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'location']

class ProductionPlanViewSet(viewsets.ModelViewSet):
    queryset = ProductionPlans.objects.all().order_by('-created_at')
    serializer_class = ProductionPlanSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    search_fields = ['name', 'description']
    filterset_fields = ['start_date', 'end_date']

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Products.objects.all().order_by('-created_at')
    serializer_class = ProductSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    search_fields = ['name', 'sku', 'description']

class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Projects.objects.all().order_by('-start_date')
    serializer_class = ProjectSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    search_fields = ['name', 'description']
    filterset_fields = ['status']

class PurchaseOrderViewSet(viewsets.ModelViewSet):
    queryset = PurchaseOrders.objects.all().order_by('-order_date')
    serializer_class = PurchaseOrderSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    search_fields = ['supplier__name', 'status']
    filterset_fields = ['status', 'supplier']

class QualityCheckViewSet(viewsets.ModelViewSet):
    queryset = QualityChecks.objects.all().order_by('-check_date')
    serializer_class = QualityCheckSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    search_fields = ['product__name', 'result']
    filterset_fields = ['product', 'result']

class SalesOrderViewSet(viewsets.ModelViewSet):
    queryset = SalesOrders.objects.all().order_by('-order_date')
    serializer_class = SalesOrderSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    search_fields = ['customer__name', 'status']
    filterset_fields = ['status', 'customer']

class ShipmentViewSet(viewsets.ModelViewSet):
    queryset = Shipments.objects.all().order_by('-shipment_date')
    serializer_class = ShipmentSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    search_fields = ['tracking_number', 'carrier__name']
    filterset_fields = ['status', 'carrier']

class SpcMeasurementViewSet(viewsets.ModelViewSet):
    queryset = SpcMeasurements.objects.all().order_by('parameter_name')
    serializer_class = SpcMeasurementSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['quality_check']  # Modifié de 'check' à 'quality_check'

class StockLevelViewSet(viewsets.ModelViewSet):
    queryset = StockLevels.objects.all().order_by('-last_updated')
    serializer_class = StockLevelSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    search_fields = ['product__name', 'warehouse__name']
    filterset_fields = ['warehouse', 'product']

class SupplierViewSet(viewsets.ModelViewSet):
    queryset = Suppliers.objects.all().order_by('-created_at')
    serializer_class = SupplierSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    search_fields = ['name', 'contact_info']

class SupportTicketViewSet(viewsets.ModelViewSet):
    queryset = SupportTickets.objects.all().order_by('-created_at')
    serializer_class = SupportTicketSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    search_fields = ['subject', 'customer__name', 'description']
    filterset_fields = ['status', 'priority', 'customer']

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Tasks.objects.all().order_by('due_date')
    serializer_class = TaskSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    search_fields = ['name', 'description']
    filterset_fields = ['status', 'project']

class TicketResponseViewSet(viewsets.ModelViewSet):
    queryset = TicketResponses.objects.all().order_by('-created_at')
    serializer_class = TicketResponseSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['ticket', 'employee']

class WarehouseViewSet(viewsets.ModelViewSet):
    queryset = Warehouses.objects.all().order_by('-created_at')
    serializer_class = WarehouseSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'location']

class WorkOrderViewSet(viewsets.ModelViewSet):
    queryset = WorkOrders.objects.all().order_by('-start_date')
    serializer_class = WorkOrderSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    search_fields = ['product__name']
    filterset_fields = ['status', 'product']