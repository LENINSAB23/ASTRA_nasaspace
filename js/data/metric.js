/** Define una métrica de un subsistema: valor = nominal + delta × daño. */
export function metric(label, unit, nominal, delta, decimals = 0) {
  return { label, unit, nominal, delta, decimals };
}

export function metricValue(def, damage) {
  return (def.nominal + def.delta * damage).toFixed(def.decimals);
}
