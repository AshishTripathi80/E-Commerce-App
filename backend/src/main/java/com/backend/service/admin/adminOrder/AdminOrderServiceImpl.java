package com.backend.service.admin.adminOrder;

import com.backend.dto.AnalyticsResponse;
import com.backend.dto.OrderDto;
import com.backend.entity.Order;
import com.backend.enums.OrderStatus;
import com.backend.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDate;
import java.util.*;
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

    public AnalyticsResponse calculateAnalytics(){
        LocalDate currentDate=LocalDate.now();
        LocalDate previousMonthDate =currentDate.minusMonths(1);

        Long currentMonthOrders= getTotalOrdersForMonth(currentDate.getMonthValue(),currentDate.getYear());
        Long previousMontOrders= getTotalOrdersForMonth(previousMonthDate.getMonthValue(),previousMonthDate.getYear());

        Long currentMonthEarning = getTotalEarningsForMonth(currentDate.getMonthValue(),currentDate.getYear());
        Long previousMontEarning = getTotalEarningsForMonth(previousMonthDate.getMonthValue(),previousMonthDate.getYear());

        Long placed = orderRepository.countByOrderStatus(OrderStatus.Placed);
        Long shipped = orderRepository.countByOrderStatus(OrderStatus.Shipped);
        Long delivered= orderRepository.countByOrderStatus(OrderStatus.Delivered);

        return new AnalyticsResponse(placed,shipped,delivered,currentMonthOrders,previousMontOrders,
                currentMonthEarning,previousMontEarning);
    }

    private Long getTotalEarningsForMonth(int month, int year) {
        Calendar calendar=Calendar.getInstance();
        calendar.set(Calendar.YEAR,year);
        calendar.set(Calendar.MONTH,month-1);
        calendar.set(Calendar.DAY_OF_MONTH, 1);
        calendar.set(Calendar.HOUR_OF_DAY,0);
        calendar.set(Calendar.MINUTE,0);
        calendar.set(Calendar.SECOND,0);

        Date startOfMonth=calendar.getTime();

        //Move the calendar to the end of the specified month
        calendar.set(Calendar.DAY_OF_MONTH,calendar.getActualMaximum(Calendar.DAY_OF_MONTH));
        calendar.set(Calendar.HOUR_OF_DAY,23);
        calendar.set(Calendar.MINUTE,59);
        calendar.set(Calendar.SECOND,59);

        Date endOfMonth = calendar.getTime();

        List<Order> orders=orderRepository.findByDateBetweenAndOrderStatus(startOfMonth,endOfMonth,OrderStatus.Delivered);

        Long sum=0L;
        for (Order order :orders){
            sum+=order.getAmount();
        }
        return sum;
    }

    private Long getTotalOrdersForMonth(int month, int year) {
        Calendar calendar=Calendar.getInstance();
        calendar.set(Calendar.YEAR,year);
        calendar.set(Calendar.MONTH,month-1);
        calendar.set(Calendar.DAY_OF_MONTH, 1);
        calendar.set(Calendar.HOUR_OF_DAY,0);
        calendar.set(Calendar.MINUTE,0);
        calendar.set(Calendar.SECOND,0);

        Date startOfMonth=calendar.getTime();

        //Move the calendar to the end of the specified month
        calendar.set(Calendar.DAY_OF_MONTH,calendar.getActualMaximum(Calendar.DAY_OF_MONTH));
        calendar.set(Calendar.HOUR_OF_DAY,23);
        calendar.set(Calendar.MINUTE,59);
        calendar.set(Calendar.SECOND,59);

        Date endOfMonth = calendar.getTime();

        List<Order> orders=orderRepository.findByDateBetweenAndOrderStatus(startOfMonth,endOfMonth,OrderStatus.Delivered);

        return (long)orders.size();

    }
}
