import 'dart:io';

import 'package:flutter_test/flutter_test.dart';
import 'package:sidera/core/copy.dart';
import 'package:sidera/core/models.dart';
import 'package:sidera/core/rules.dart';

void main() {
  test('chart style follows birthplace', () {
    expect(defaultChartStyle('Chennai, Tamil Nadu, India'), ChartStyle.south);
    expect(defaultChartStyle('Bengaluru, Karnataka, India'), ChartStyle.south);
    expect(defaultChartStyle('Jaipur, Rajasthan, India'), ChartStyle.north);
  });

  test('phone numbers', () {
    expect(normaliseIndianPhone('98765 43210'), '+919876543210');
    expect(normaliseIndianPhone('+91 98765-43210'), '+919876543210');
    expect(normaliseIndianPhone('09876543210'), '+919876543210');
    expect(normaliseIndianPhone('12345 67890'), isNull);
  });

  test('birth dates', () {
    final today = DateTime(2026, 11, 5);
    expect(checkBirthDate(1995, 2, 31, today: today), DobError.invalid);
    expect(checkBirthDate(2027, 1, 1, today: today), DobError.future);
    expect(checkBirthDate(1996, 2, 29, today: today), isNull);
  });

  test('credit bands and houses', () {
    expect(creditBand(0.5), CreditBand.ok);
    expect(creditBand(0.2), CreditBand.low);
    expect(creditBand(0), CreditBand.empty);
    expect(signOfHouse(11, 3), 1);
    expect(southSignCells.toSet().length, 12);
  });

  test('copy fills placeholders and every key the app uses exists', () {
    Copy.loadFrom(File('assets/copy/en.json').readAsStringSync());
    expect(t('home.greeting', {'PART': 'morning', 'NAME': 'Aarav'}), 'Good morning, Aarav');
    expect(fill('{A} {B}', {'A': 1}), '1 {B}');
    // Every t('...') key in lib/ resolves.
    final keys = <String>{};
    for (final f in Directory('lib').listSync(recursive: true).whereType<File>().where((f) => f.path.endsWith('.dart'))) {
      for (final m in RegExp(r"\bt\('([a-zA-Z.]+)'").allMatches(f.readAsStringSync())) {
        keys.add(m[1]!);
      }
    }
    for (final k in keys) {
      expect(() => t(k), returnsNormally, reason: k);
    }
  });
}
