// Pure rules shared by the screens. Mirrors apps/web/src/lib/rules.ts.
import 'models.dart';

const southStates = ['Tamil Nadu', 'Kerala', 'Karnataka', 'Andhra Pradesh', 'Telangana', 'Puducherry'];

ChartStyle defaultChartStyle(String region) =>
    southStates.any((s) => region.toLowerCase().contains(s.toLowerCase())) ? ChartStyle.south : ChartStyle.north;

/// Indian mobile: 10 digits starting 6-9, with or without +91 / 0. Returns E.164 or null.
String? normaliseIndianPhone(String input) {
  final d = input.replaceAll(RegExp(r'\D'), '');
  final local = d.length == 12 && d.startsWith('91')
      ? d.substring(2)
      : d.length == 11 && d.startsWith('0')
          ? d.substring(1)
          : d;
  return RegExp(r'^[6-9]\d{9}$').hasMatch(local) ? '+91$local' : null;
}

enum DobError { invalid, future }

/// Rejects impossible dates (Feb 31), years before 1900 and dates after [today].
DobError? checkBirthDate(int y, int m, int d, {DateTime? today}) {
  final dt = DateTime.utc(y, m, d);
  if (dt.year != y || dt.month != m || dt.day != d || y < 1900) return DobError.invalid;
  final now = today ?? DateTime.now();
  return dt.isAfter(DateTime.utc(now.year, now.month, now.day)) ? DobError.future : null;
}

DayPart dayPartOf(int hour) {
  if (hour >= 5 && hour < 12) return DayPart.morning;
  if (hour >= 12 && hour < 17) return DayPart.afternoon;
  if (hour >= 17 && hour < 21) return DayPart.evening;
  return DayPart.night;
}

enum CreditBand { ok, low, empty }

/// Over 20% normal, 20% or less low (one nudge), 0 empty.
CreditBand creditBand(double f) => f <= 0 ? CreditBand.empty : (f <= 0.2 ? CreditBand.low : CreditBand.ok);

int signOfHouse(int ascSign, int house) => ((ascSign - 1 + house - 1) % 12) + 1;

/// North Indian: label anchors for houses 1..12 in a 0..100 square (house 1 top centre, counter-clockwise).
const northHouseAnchors = [
  (50.0, 25.0), (25.0, 10.0), (10.0, 25.0), (25.0, 50.0), (10.0, 75.0), (25.0, 90.0),
  (50.0, 75.0), (75.0, 90.0), (90.0, 75.0), (75.0, 50.0), (90.0, 25.0), (75.0, 10.0),
];
const northSignAnchors = [
  (50.0, 42.0), (25.0, 20.0), (20.0, 25.0), (42.0, 50.0), (20.0, 75.0), (25.0, 80.0),
  (50.0, 58.0), (75.0, 80.0), (80.0, 75.0), (58.0, 50.0), (80.0, 25.0), (75.0, 20.0),
];

/// South Indian: [col, row] in a 4x4 grid for signs 1..12, Pisces top-left.
const southSignCells = [
  (1, 0), (2, 0), (3, 0), (3, 1), (3, 2), (3, 3),
  (2, 3), (1, 3), (0, 3), (0, 2), (0, 1), (0, 0),
];
