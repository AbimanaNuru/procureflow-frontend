export const PERMISSIONS = {
    // Purchase Request Permissions
    ADD_PURCHASE_REQUEST: 'procurement.add_purchaserequest',
    VIEW_PURCHASE_REQUEST: 'procurement.view_purchaserequest',
    CHANGE_PURCHASE_REQUEST: 'procurement.change_purchaserequest',
    APPROVE_PURCHASE_REQUEST: 'procurement.approve_purchaserequest',
    REJECT_PURCHASE_REQUEST: 'procurement.reject_purchaserequest',

    // Request Item Permissions
    ADD_REQUEST_ITEM: 'procurement.add_requestitem',
    VIEW_REQUEST_ITEM: 'procurement.view_requestitem',
    CHANGE_REQUEST_ITEM: 'procurement.change_requestitem',

    // Purchase Order Permissions
    VIEW_PURCHASE_ORDER: 'procurement.view_purchaseorder',
    ADD_PURCHASE_ORDER: 'procurement.add_purchaseorder',
    CHANGE_PURCHASE_ORDER: 'procurement.change_purchaseorder',
} as const;
