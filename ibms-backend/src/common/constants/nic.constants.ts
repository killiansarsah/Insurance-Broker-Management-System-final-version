/**
 * NIC (National Insurance Commission) Constants
 * Ghana Insurance Act 2021
 */

/** NIC withholding levy rate — 7.5% of gross commission */
export const NIC_LEVY_RATE = 0.075;

/** Broker retention rate — 92.5% (1 - NIC_LEVY_RATE) */
export const NIC_LEVY_RETENTION = 1 - NIC_LEVY_RATE;

/**
 * NIC standard commission rates by policy type.
 * These are the regulator-mandated maximum rates for Ghana.
 * Key matches InsuranceType enum or product sub-type.
 */
export const NIC_COMMISSION_RATES: Record<string, number> = {
  // Motor
  MOTOR_COMPREHENSIVE: 16.5,
  MOTOR_TPFT: 13.5,
  MOTOR_TP: 10.0,
  // Fire / Property
  FIRE: 20.0,
  // Marine
  MARINE: 20.0,
  // Bonds
  BONDS: 18.0,
  // Liability
  WORKMENS_COMP: 22.0,
  PUBLIC_LIABILITY: 22.0,
  PROFESSIONAL_INDEMNITY: 22.0,
  // Other Non-Life
  ASSETS_ALL_RISK: 21.0,
  GOODS_IN_TRANSIT: 20.0,
  FIDELITY_GUARANTEE: 20.0,
  MONEY: 20.0,
  ENGINEERING: 20.0,
  // Life
  GROUP_LIFE: 20.0,
  TERM_LIFE: 25.0,
  WHOLE_LIFE: 30.0,
  ENDOWMENT: 28.0,
  // Other
  TRAVEL: 22.0,
  HEALTH: 10.0,
};
