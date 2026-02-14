# Business Requirements Certification: Insurance Broker Management System (IBMS)

**Project Name:** IBMS - Ghana Edition  
**Regulatory Body:** National Insurance Commission (NIC), Ghana  
**Document Reference:** [IBMS_SRS_Ghana_Complete.md](file:///c:/Users/Owner/Desktop/ibms/IBMS_SRS_Ghana_Complete.md)  
**Certification Date:** February 14, 2026  

---

## 1. Executive Certification Statement

This document certifies that the **Insurance Broker Management System (IBMS)** has been designed and specified to meet the core operational requirements of an insurance brokerage firm in Ghana. The system architecture and functional modules align with the **Insurance Act 2021 (Act 1061)** and **NIC Ghana directives**.

---

## 2. Certified Business Modules

The system is certified for the following core business functions:

### 2.1 Client Management (KYC/AML)
- **Certification Standard:** Anti-Money Laundering Act 2020 (Act 1044).
- **Core Features:** 
  - Mandatory Ghana Card verification.
  - Digital address mapping.
  - Politically Exposed Persons (PEP) screening.
  - 6-year data retention for audit trails.

### 2.2 Policy Management
- **Certification Standard:** NIC Policy Administration Guidelines.
- **Core Features:**
  - Full lifecycle support (Draft, Underwriting, Active, Renewal, Lapse).
  - Automated renewal notifications (90/60/30 day intervals).
  - Pro-rata premium and refund calculations.

### 2.3 Claims Management (FNOL)
- **Certification Standard:** NIC Claims Processing Directives.
- **Core Features:**
  - Mandatory acknowledgment within 5 working days.
  - 30-day resolution tracking and escalation.
  - Secure document repository for claim evidence.

### 2.4 Lead & Sales Pipeline
- **Certification Standard:** Brokerage Sales & Marketing Best Practices.
- **Core Features:**
  - Automated commission tracking and reconciliation.
  - Multi-channel lead acquisition and conversion analytics.

---

## 3. Regulatory Alignment Matrix

| Requirement Area | Source Regulation | System Capability |
|------------------|-------------------|-------------------|
| Data Privacy | Data Protection Act 2012 (Act 843) | Encrypted storage, consent management, access logs. |
| Financial Integrity | NIC Premium Payment Directives | Mobile Money & Bank integration with receipting. |
| Operational Audit | Insurance Act 2021 (Act 1061) | Comprehensive audit log for all user actions. |
| Reporting | NIC Monthly/Quarterly Reporting | Automated report generation in NIC-prescribed formats. |

---

## 4. System Integrity & Security

- **Authentication:** Mandatory 2FA for high-privilege roles (Admin, Compliance).
- **Auditability:** Tamper-proof logging of all data modifications.
- **Backup & Recovery:** Daily encrypted backups with off-site redundancy.

---

## 5. Formal Sign-off

*This certification is valid upon sign-off by the authorized representatives.*

| Role | Name | Signature | Date |
|------|------|-----------|------|
| **Managing Director** | | | |
| **Compliance Officer** | | | |
| **Technical Lead** | | | |

---

> [!NOTE]
> This document is a summary of the detailed requirements specified in the [Complete SRS](file:///c:/Users/Owner/Desktop/ibms/IBMS_SRS_Ghana_Complete.md).
