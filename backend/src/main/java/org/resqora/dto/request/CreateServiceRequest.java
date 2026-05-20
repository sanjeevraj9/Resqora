package org.resqora.dto.request;


import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.resqora.enums.IssueType;

import java.math.BigDecimal;

@Data
public class CreateServiceRequest {

    @NotNull
    private Long vehicleId;

    @NotNull
    private IssueType issueType;
    @NotNull
    private String description;

    @NotNull
    private BigDecimal latitude;
    @NotNull
    private BigDecimal longitude;

    private BigDecimal estimatedPrice;
}
