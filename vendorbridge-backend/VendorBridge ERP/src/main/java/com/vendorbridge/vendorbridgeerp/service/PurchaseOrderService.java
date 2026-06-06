package com.vendorbridge.vendorbridgeerp.service;

import com.vendorbridge.vendorbridgeerp.dto.request.PurchaseOrderRequest;
import com.vendorbridge.vendorbridgeerp.dto.response.PurchaseOrderResponse;

import java.util.List;

public interface PurchaseOrderService {
    PurchaseOrderResponse createPurchaseOrder(PurchaseOrderRequest request);
    List<PurchaseOrderResponse> getAllPurchaseOrders();
    PurchaseOrderResponse getPurchaseOrderById(Long id);
    PurchaseOrderResponse updatePurchaseOrder(Long id, PurchaseOrderRequest request);
}
