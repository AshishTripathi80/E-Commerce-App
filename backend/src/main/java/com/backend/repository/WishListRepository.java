package com.backend.repository;

import com.backend.entity.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WishListRepository extends JpaRepository<Wishlist,Long> {

    List<Wishlist> findAllByUserId(Long userId);
}
