package com.backend.entity;

import com.backend.dto.ProductDto;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "product")
public class Product {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private Long price;

    @Lob
    private String description;

    @Lob
    @Column(columnDefinition = "longblob")
    private byte[] img;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "category_id", nullable = false)
    @JsonIgnore
    private Category category;


    public ProductDto getDto(){
        ProductDto dto = new ProductDto();
        dto.setId(id);
        dto.setName(name);
        dto.setPrice(price);
        dto.setDescription(description);
        dto.setByteImg(img);
        dto.setCategoryId(category.getId());
        dto.setCategoryName(category.getName());
        return dto;
    }

}
