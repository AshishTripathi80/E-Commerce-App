package com.backend.service.admin.adminOrder;

import com.backend.dto.OrderDto;
import com.backend.entity.Order;
import com.backend.enums.OrderStatus;
import com.backend.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminOrderServiceImpl implements AdminOrderService{


    private final OrderRepository orderRepository;

    private static final Logger logger = LoggerFactory.getLogger(AdminOrderService.class);

    public List<OrderDto> getAllPlacedOrders() {
        List<Order> orderList = orderRepository.
                findAllByOrderStatusIn(List.of(OrderStatus.Placed, OrderStatus.Shipped, OrderStatus.Delivered));

        return orderList.stream().map(Order::getOrderDto).collect(Collectors.toList());

    }

    public OrderDto changeOrderStatus(Long orderId, String status) {
        logger.info("Attempting to change order status for orderId: {}, new status: {}", orderId, status);

        Optional<Order> optionalOrder = orderRepository.findById(orderId);
        if (optionalOrder.isPresent()) {
            Order order = optionalOrder.get();
            logger.info("Order found with orderId: {}", orderId);

            if (Objects.equals(status, "Shipped")) {
                logger.info("Setting status to Shipped for orderId: {}", orderId);
                order.setOrderStatus(OrderStatus.Shipped);
            } else if (Objects.equals(status, "Delivered")) {
                logger.info("Setting status to Delivered for orderId: {}", orderId);
                order.setOrderStatus(OrderStatus.Delivered);
            } else {
                logger.warn("Invalid status: {} for orderId: {}", status, orderId);
            }

            Order savedOrder = orderRepository.save(order);
            logger.info("Order status updated successfully for orderId: {}", orderId);
            return savedOrder.getOrderDto();
        } else {
            logger.warn("Order not found for orderId: {}", orderId);
        }

        return null;
    }
}
