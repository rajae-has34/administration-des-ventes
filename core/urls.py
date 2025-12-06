from django.urls import path, include
from rest_framework import routers
from . import views

router = routers.DefaultRouter()

router.register(r'carriers', views.CarrierViewSet)
router.register(r'contacts', views.ContactViewSet)
router.register(r'customers', views.CustomerViewSet)
router.register(r'employees', views.EmployeeViewSet)
router.register(r'interactions', views.InteractionViewSet)
router.register(r'inventory-movements', views.InventoryMovementViewSet)
router.register(r'invoices', views.InvoiceViewSet)
router.register(r'kpis', views.KpiViewSet)
router.register(r'kpi-measurements', views.KpiMeasurementViewSet)
router.register(r'locations', views.LocationViewSet)
router.register(r'operations', views.OperationViewSet)
router.register(r'order-items', views.OrderItemViewSet)
router.register(r'payments', views.PaymentViewSet)
router.register(r'payroll', views.PayrollViewSet)
router.register(r'plan-items', views.PlanItemViewSet)
router.register(r'po-items', views.PoItemViewSet)
router.register(r'production-lines', views.ProductionLineViewSet)
router.register(r'production-plans', views.ProductionPlanViewSet)
router.register(r'products', views.ProductViewSet)
router.register(r'projects', views.ProjectViewSet)
router.register(r'purchase-orders', views.PurchaseOrderViewSet)
router.register(r'quality-checks', views.QualityCheckViewSet)
router.register(r'sales-orders', views.SalesOrderViewSet)
router.register(r'shipments', views.ShipmentViewSet)
router.register(r'spc-measurements', views.SpcMeasurementViewSet)
router.register(r'stock-levels', views.StockLevelViewSet)
router.register(r'suppliers', views.SupplierViewSet)
router.register(r'support-tickets', views.SupportTicketViewSet)
router.register(r'tasks', views.TaskViewSet)
router.register(r'ticket-responses', views.TicketResponseViewSet)
router.register(r'warehouses', views.WarehouseViewSet)
router.register(r'work-orders', views.WorkOrderViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
