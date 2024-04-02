const fareQuote={
    "FirstNameFormat": "If FirstName is missing, Update FirstName as title.",
                "IsBookableIfSeatNotAvailable": false,
                "IsHoldAllowedWithSSR": true,
                "LastNameFormat": "If LastName is missing, Update LastName as FIRSTNAME and First name as title.",
                "ResultIndex": "OB1",
                "Source": 4,
                "IsLCC": false,
                "IsRefundable": false,
                "IsPanRequiredAtBook": false,
                "IsPanRequiredAtTicket": false,
                "IsPassportRequiredAtBook": false,
                "IsPassportRequiredAtTicket": true,
                "GSTAllowed": true,
                "IsCouponAppilcable": true,
                "IsGSTMandatory": false,
                "IsHoldAllowed": true,
                "AirlineRemark": null,
                "IsPassportFullDetailRequiredAtBook": false,
                "ResultFareType": "RegularFare",
                "Fare": {
                    "Currency": "INR",
                    "BaseFare": 895780,
                    "Tax": 501002,
                    "TaxBreakup": [
                        {
                            "key": "K3",
                            "value": 139236
                        },
                        {
                            "key": "YQTax",
                            "value": 175440
                        },
                        {
                            "key": "YR",
                            "value": 89058
                        },
                        {
                            "key": "PSF",
                            "value": 0
                        },
                        {
                            "key": "UDF",
                            "value": 0
                        },
                        {
                            "key": "INTax",
                            "value": 372
                        },
                        {
                            "key": "TransactionFee",
                            "value": 0
                        },
                        {
                            "key": "OtherTaxes",
                            "value": 96896
                        }
                    ],
                    "YQTax": 175440,
                    "AdditionalTxnFeeOfrd": 0,
                    "AdditionalTxnFeePub": 0,
                    "PGCharge": 0,
                    "OtherCharges": 0,
                    "ChargeBU": [
                        {
                            "key": "TBOMARKUP",
                            "value": 0
                        },
                        {
                            "key": "GLOBALPROCUREMENTCHARGE",
                            "value": 0
                        },
                        {
                            "key": "CONVENIENCECHARGE",
                            "value": 0
                        },
                        {
                            "key": "OTHERCHARGE",
                            "value": 0
                        }
                    ],
                    "Discount": 0,
                    "PublishedFare": 1396782,
                    "CommissionEarned": 0,
                    "PLBEarned": 0,
                    "IncentiveEarned": 0,
                    "OfferedFare": 1396782,
                    "TdsOnCommission": 0,
                    "TdsOnPLB": 0,
                    "TdsOnIncentive": 0,
                    "ServiceFee": 0,
                    "TotalBaggageCharges": 0,
                    "TotalMealCharges": 0,
                    "TotalSeatCharges": 0,
                    "TotalSpecialServiceCharges": 0
                },
                "FareBreakdown": [
                    {
                        "Currency": "INR",
                        "PassengerType": 1,
                        "PassengerCount": 4,
                        "BaseFare": 651480,
                        "Tax": 343472,
                        "TaxBreakUp": [
                            {
                                "key": "YQTax",
                                "value": 116960
                            },
                            {
                                "key": "YR",
                                "value": 59372
                            },
                            {
                                "key": "K3",
                                "value": 99340
                            },
                            {
                                "key": "INTax",
                                "value": 248
                            },
                            {
                                "key": "OtherTaxes",
                                "value": 67552
                            }
                        ],
                        "YQTax": 116960,
                        "AdditionalTxnFeeOfrd": 0,
                        "AdditionalTxnFeePub": 0,
                        "PGCharge": 0,
                        "SupplierReissueCharges": 0
                    },
                    {
                        "Currency": "INR",
                        "PassengerType": 2,
                        "PassengerCount": 2,
                        "BaseFare": 244300,
                        "Tax": 157530,
                        "TaxBreakUp": [
                            {
                                "key": "YQTax",
                                "value": 58480
                            },
                            {
                                "key": "YR",
                                "value": 29686
                            },
                            {
                                "key": "K3",
                                "value": 39896
                            },
                            {
                                "key": "INTax",
                                "value": 124
                            },
                            {
                                "key": "OtherTaxes",
                                "value": 29344
                            }
                        ],
                        "YQTax": 58480,
                        "AdditionalTxnFeeOfrd": 0,
                        "AdditionalTxnFeePub": 0,
                        "PGCharge": 0,
                        "SupplierReissueCharges": 0
                    }
                ],
                "MiniFareRules": [
                    [
                        {
                            "JourneyPoints": "DEL-MUC-MXP-ZRH-VCE-FCO-NAP-FCO-FRA-DEL",
                            "Type": "Reissue",
                            "From": null,
                            "To": null,
                            "Unit": null,
                            "Details": "INR 13415"
                        },
                        {
                            "JourneyPoints": "DEL-MUC-MXP-ZRH-VCE-FCO-NAP-FCO-FRA-DEL",
                            "Type": "Cancellation",
                            "From": null,
                            "To": null,
                            "Unit": null,
                            "Details": "REFER TO DETAILED FARE RULES"
                        }
                    ]
                ],
    
}

module.exports =fareQuote;
