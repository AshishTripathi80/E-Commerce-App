package com.backend.repository;

import com.backend.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem,Long> {

    Optional<CartItem> findByProductIdAndOrderIdAndUserId(Long productId,Long orderId,Long userId);


}
