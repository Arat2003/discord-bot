export function getLevel(exp: number) {
  const EXP_NEEDED = [
    100000,
    150000,
    250000,
    500000,
    750000,
    1000000,
    1250000,
    1500000,
    2000000,
    2500000,
    2500000,
    2500000,
    2500000,
    2500000,
    3000000,
  ];

  let level = 0;

  // Increments by one from zero to the level cap
  for (let i = 0; i <= 200; i++) {
    // need is the required exp to get to the next level
    let need = 0;
    if (i >= EXP_NEEDED.length) {
      need = EXP_NEEDED[EXP_NEEDED.length - 1];
    } else {
      need = EXP_NEEDED[i];
    }

    // If the required exp to get to the next level isn't met returns
    // the current level plus progress towards the next (unused exp/need)
    // Otherwise increments the level and substracts the used exp from exp var
    if (exp - need < 0) {
      return {
        level: Math.round((level + exp / need) * 100) / 100,
        xpNeeded: (exp -= need),
      };
    }
    level += 1;
    exp -= need;
  }

  // Returns the level cap - currently 100
  // If changed here, also change in for loop above
  return { level: 200, xpNeeded: exp };
}

export function guildScaledExp(exp: number) {
  let scaledExp = 0;
  if (exp > 200000) {
    scaledExp += 200000;
    exp -= 200000;
    if (exp > 50000) {
      scaledExp += 50000 * 0.1;
      exp -= 50000;
      if (exp != 0) {
        scaledExp += exp * 0.03;
      }
    } else {
      scaledExp += exp * 0.1;
    }
  } else {
    scaledExp = exp;
  }
  return scaledExp.toFixed(1).replace(".0", "");
}
