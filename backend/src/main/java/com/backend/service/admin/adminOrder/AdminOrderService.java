package com.backend.service.admin.adminOrder;

import com.backend.dto.AnalyticsResponse;
import com.backend.dto.OrderDto;

import java.util.List;

public interface AdminOrderService {

    List<OrderDto> getAllPlacedOrders();

    OrderDto changeOrderStatus(Long orderId, String status);

    AnalyticsResponse calculateAnalytics();
}
