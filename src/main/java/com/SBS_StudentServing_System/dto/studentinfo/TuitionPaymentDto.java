package com.SBS_StudentServing_System.dto.studentinfo;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TuitionPaymentDto {
    private String studentId;
    private String scholarshipId; // can be null
    private int paymentStatus;
    private int paymentMethod;
    private double amountPaid;
}
