package com.backend.service.customer.cart;

import com.backend.dto.AddProductInCartDto;
import com.backend.dto.CartItemDto;
import com.backend.dto.OrderDto;
import com.backend.dto.PlaceOrderDto;
import com.backend.entity.*;
import com.backend.enums.OrderStatus;
import com.backend.exceptions.ValidationException;
import com.backend.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class CartServiceImpl implements CartService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CouponRepository couponRepository;

    private static final Logger logger = LoggerFactory.getLogger(CartServiceImpl.class);


    public ResponseEntity<?> addProductToCart(AddProductInCartDto addProductInCartDto) {
        Order activeOrder = orderRepository.findByUserIdAndOrderStatus(addProductInCartDto.getUserId(), OrderStatus.Pending);


        if (activeOrder == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Active order not found");
        }

        Optional<CartItem> optionalCartItem = cartItemRepository.findByProductIdAndOrderIdAndUserId(addProductInCartDto.getProductId(), activeOrder.getId(), addProductInCartDto.getUserId());

        if (optionalCartItem.isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Product already in cart");
        } else {
            Optional<Product> optionalProduct = productRepository.findById(addProductInCartDto.getProductId());
            Optional<User> optionalUser = userRepository.findById(addProductInCartDto.getUserId());

            if (optionalProduct.isPresent() && optionalUser.isPresent()) {
                CartItem cart = new CartItem();
                cart.setProduct(optionalProduct.get());
                cart.setPrice(optionalProduct.get().getPrice());
                cart.setQuantity(1L);
                cart.setUser(optionalUser.get());
                cart.setOrder(activeOrder);

                CartItem updatedCart = cartItemRepository.save(cart);


                activeOrder.setTotalAmount(activeOrder.getTotalAmount() + cart.getPrice());
                activeOrder.setAmount(activeOrder.getAmount() + cart.getPrice());
                activeOrder.getCartItems().add(cart);

                orderRepository.save(activeOrder);

                return ResponseEntity.status(HttpStatus.CREATED).body(updatedCart);
            } else {

                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User or Product not found");
            }
        }
    }

    public OrderDto getCartByUserId(Long userId){
        Order activeOrder=orderRepository.findByUserIdAndOrderStatus(userId,OrderStatus.Pending);

        List<CartItemDto> cartItemDtoList=activeOrder.getCartItems().stream().map(CartItem::getCartDto).collect(Collectors.toList());

        OrderDto orderDto=new OrderDto();
        orderDto.setAmount(activeOrder.getAmount());
        orderDto.setId(activeOrder.getId());
        orderDto.setOrderStatus(activeOrder.getOrderStatus());
        orderDto.setDiscount(activeOrder.getDiscount());
        orderDto.setTotalAmount(activeOrder.getTotalAmount());
        orderDto.setCartItems(cartItemDtoList);
        if (activeOrder.getCoupon() !=null){
            orderDto.setCouponName(activeOrder.getCoupon().getName());
        }

        return orderDto;
    }

    public OrderDto applyCoupon(Long userId, String code) {
        logger.info("Applying coupon for userId: {} and coupon code: {}", userId, code);

        Order activeOrder = orderRepository.findByUserIdAndOrderStatus(userId, OrderStatus.Pending);
        logger.debug("Active order found: {}", activeOrder);

        Coupon coupon = couponRepository.findByCode(code)
                .orElseThrow(() -> new ValidationException("Coupon not found."));
        logger.debug("Coupon found: {}", coupon);

        if (couponIsExpired(coupon)) {
            logger.warn("Coupon {} has expired.", code);
            throw new ValidationException("Coupon has expired");
        }

        double discountAmount = (coupon.getDiscount() / 100.0) * activeOrder.getTotalAmount();
        double netAmount = activeOrder.getTotalAmount() - discountAmount;

        logger.debug("Discount amount: {}, Net amount after discount: {}", discountAmount, netAmount);

        activeOrder.setAmount((long) netAmount);
        activeOrder.setDiscount((long) discountAmount);
        activeOrder.setCoupon(coupon);

        orderRepository.save(activeOrder);
        logger.info("Order updated and saved successfully for userId: {}", userId);

        return activeOrder.getOrderDto();
    }

    private boolean couponIsExpired(Coupon coupon){
        Date currentDate= new Date();
        Date expirationDate= coupon.getExpirationDate();

        return expirationDate != null && currentDate.after(expirationDate);
    }

    public OrderDto increaseProductQuantity(AddProductInCartDto addProductInCartDto){
        Order activeOrder=orderRepository.findByUserIdAndOrderStatus(addProductInCartDto.getUserId(), OrderStatus.Pending);
        Optional<Product> optionalProduct=productRepository.findById(addProductInCartDto.getProductId());

        Optional<CartItem> optionalCartItem=cartItemRepository.findByProductIdAndOrderIdAndUserId(addProductInCartDto.getProductId(), activeOrder.getId(), addProductInCartDto.getUserId());

        if (optionalProduct.isPresent() && optionalCartItem.isPresent()){
            CartItem cartItem=optionalCartItem.get();
            Product product=optionalProduct.get();

            activeOrder.setAmount(activeOrder.getAmount()+ product.getPrice());
            activeOrder.setTotalAmount(activeOrder.getTotalAmount()+ product.getPrice());

            cartItem.setQuantity(cartItem.getQuantity()+1);

            if (activeOrder.getCoupon() != null){
                double discountAmount = (activeOrder.getCoupon().getDiscount() / 100.0) * activeOrder.getTotalAmount();
                double netAmount = activeOrder.getTotalAmount() - discountAmount;

                activeOrder.setAmount((long) netAmount);
                activeOrder.setDiscount((long) discountAmount);
            }

            cartItemRepository.save(cartItem);
            orderRepository.save(activeOrder);
            return activeOrder.getOrderDto();
        }
        return null;
    }

    public OrderDto decreaseProductQuantity(AddProductInCartDto addProductInCartDto){
        Order activeOrder=orderRepository.findByUserIdAndOrderStatus(addProductInCartDto.getUserId(), OrderStatus.Pending);
        Optional<Product> optionalProduct=productRepository.findById(addProductInCartDto.getProductId());

        Optional<CartItem> optionalCartItem=cartItemRepository.findByProductIdAndOrderIdAndUserId(addProductInCartDto.getProductId(), activeOrder.getId(), addProductInCartDto.getUserId());

        if (optionalProduct.isPresent() && optionalCartItem.isPresent()){
            CartItem cartItem=optionalCartItem.get();
            Product product=optionalProduct.get();

            activeOrder.setAmount(activeOrder.getAmount()- product.getPrice());
            activeOrder.setTotalAmount(activeOrder.getTotalAmount()- product.getPrice());

            cartItem.setQuantity(cartItem.getQuantity()-1);

            if (activeOrder.getCoupon() != null){
                double discountAmount = (activeOrder.getCoupon().getDiscount() / 100.0) * activeOrder.getTotalAmount();
                double netAmount = activeOrder.getTotalAmount() - discountAmount;

                activeOrder.setAmount((long) netAmount);
                activeOrder.setDiscount((long) discountAmount);
            }

            cartItemRepository.save(cartItem);
            orderRepository.save(activeOrder);
            return activeOrder.getOrderDto();
        }
        return null;
    }

    public OrderDto placeOrder(PlaceOrderDto placeOrderDto){
        Order activeOrder =orderRepository.findByUserIdAndOrderStatus(placeOrderDto.getUserId(),OrderStatus.Pending);
        Optional<User> optionalUser=userRepository.findById(placeOrderDto.getUserId());
        if (optionalUser.isPresent()){
            activeOrder.setOrderDescription(placeOrderDto.getOrderDescription());
            activeOrder.setAddress(placeOrderDto.getAddress());
            activeOrder.setDate(new Date());
            activeOrder.setOrderStatus(OrderStatus.Placed);
            activeOrder.setTrackingId(UUID.randomUUID());

            orderRepository.save(activeOrder);

            Order order=new Order();
            order.setAmount(0L);
            order.setTotalAmount(0L);
            order.setDiscount(0L);
            order.setUser(optionalUser.get());
            order.setOrderStatus(OrderStatus.Pending);
            orderRepository.save(order);

            return activeOrder.getOrderDto();
        }
        return null;
    }

    public List<OrderDto> getMyPlacedOrders(Long userId){
        return orderRepository.findByUserIdAndOrderStatusIn(userId,List.of(OrderStatus.Placed,
                OrderStatus.Shipped, OrderStatus.Delivered)).stream().map(Order::getOrderDto)
                .collect(Collectors.toList());
    }
}
