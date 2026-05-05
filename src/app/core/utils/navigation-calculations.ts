export function normalizeAngle(angle: number): number {
  return ((angle % 360) + 360) % 360;
}

export function angleDifference(fromDeg: number, toDeg: number): number {
  const diff = normalizeAngle(toDeg - fromDeg);
  return diff > 180 ? diff - 360 : diff;
}

export function calculateVmg(sog: number, course: number, targetBearing: number): number | null {
  if (!Number.isFinite(sog) || !Number.isFinite(course) || !Number.isFinite(targetBearing)) {
    return null;
  }

  const deltaRad = angleDifference(course, targetBearing) * Math.PI / 180;
  const vmg = sog * Math.cos(deltaRad);
  return Number.isFinite(vmg) ? parseFloat(vmg.toFixed(1)) : null;
}

export function haversineDistanceNm(lat1: number, lon1: number, lat2: number, lon2: number): number | null {
  if (
    !Number.isFinite(lat1) || !Number.isFinite(lon1) ||
    !Number.isFinite(lat2) || !Number.isFinite(lon2)
  ) {
    return null;
  }

  const toRad = (deg: number) => deg * Math.PI / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const r = 3440.065; // raggio terrestre in miglia nautiche

  const a = Math.sin(dLat / 2) ** 2
    + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = r * c;
  return Number.isFinite(distance) ? parseFloat(distance.toFixed(1)) : null;
}

export function calculateDestinationEta(distanceNm: number, sog: number): string | null {
  if (!Number.isFinite(distanceNm) || !Number.isFinite(sog) || sog <= 0) {
    return null;
  }

  const hours = distanceNm / sog;
  const totalMinutes = Math.round(hours * 60);
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export function calculateCdi(course: number, targetBearing: number): number | null {
  if (!Number.isFinite(course) || !Number.isFinite(targetBearing)) {
    return null;
  }

  return angleDifference(course, targetBearing);
}
