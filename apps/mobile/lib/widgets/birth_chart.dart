import 'package:flutter/material.dart';

import '../core/copy.dart';
import '../core/models.dart';
import '../core/rules.dart';
import '../theme/theme.dart';

/// North or South Indian kundli drawn from the same chart data. Mirrors apps/web BirthChart.
class BirthChart extends StatelessWidget {
  const BirthChart({super.key, required this.chart, this.lineColor, this.inkColor});
  final Chart chart;
  final Color? lineColor;
  final Color? inkColor;

  @override
  Widget build(BuildContext context) {
    final style = t('home.styles.${chart.style.name}');
    return Semantics(
      label: '$style chart. Ascendant ${Copy.i.list('signs')[chart.ascSign - 1]}.',
      child: AspectRatio(
        aspectRatio: 1,
        child: CustomPaint(
          painter: _ChartPainter(
            chart: chart,
            line: lineColor ?? context.c.chartLine,
            ink: inkColor ?? context.c.ink,
            asc: context.c.accentStrong,
            font: context.text.bodyMedium!.fontFamily,
            signs: Copy.i.list('signs'),
            southLabel: t('home.styles.south'),
          ),
        ),
      ),
    );
  }
}

class _ChartPainter extends CustomPainter {
  _ChartPainter({required this.chart, required this.line, required this.ink, required this.asc, required this.font,
      required this.signs, required this.southLabel});
  final Chart chart;
  final Color line, ink, asc;
  final String? font;
  final List<String> signs;
  final String southLabel;

  late double _k;

  void _text(Canvas c, String s, double x, double y, double size, Color color,
      {FontWeight w = FontWeight.w600, TextAlign align = TextAlign.center, String? sup}) {
    final tp = TextPainter(
      text: TextSpan(text: s, style: TextStyle(fontFamily: font, fontSize: size * _k, fontWeight: w, color: color), children: [
        if (sup != null) TextSpan(text: sup, style: TextStyle(fontSize: size * 0.6 * _k)),
      ]),
      textDirection: TextDirection.ltr,
    )..layout();
    final dx = align == TextAlign.center ? tp.width / 2 : (align == TextAlign.right ? tp.width : 0);
    tp.paint(c, Offset(x * _k - dx, y * _k - tp.height / 2));
  }

  void _stack(Canvas c, double x, double y, List<Planet> ps, {bool isAsc = false}) {
    final lines = <(String, bool, bool)>[if (isAsc) ('Asc', false, true), for (final p in ps) (p.id, p.retro, false)];
    final start = y - (lines.length - 1) * 4.6 / 2;
    for (var i = 0; i < lines.length; i++) {
      final l = lines[i];
      _text(c, l.$1, x, start + i * 4.6, l.$3 ? 3.4 : 3.7, l.$3 ? asc : ink, sup: l.$2 ? 'R' : null);
    }
  }

  @override
  void paint(Canvas c, Size size) {
    _k = size.width / 100;
    final frame = Paint()..color = line..style = PaintingStyle.stroke..strokeWidth = 0.7 * _k;
    final thin = Paint()..color = line..style = PaintingStyle.stroke..strokeWidth = 0.45 * _k;
    Offset o(double x, double y) => Offset(x * _k, y * _k);
    c.drawRect(Rect.fromPoints(o(1, 1), o(99, 99)), frame);

    if (chart.style == ChartStyle.north) {
      c.drawLine(o(1, 1), o(99, 99), thin);
      c.drawLine(o(99, 1), o(1, 99), thin);
      c.drawPath(Path()..moveTo(50 * _k, 1 * _k)..lineTo(99 * _k, 50 * _k)..lineTo(50 * _k, 99 * _k)..lineTo(1 * _k, 50 * _k)..close(), thin);
      for (var h = 0; h < 12; h++) {
        final a = northHouseAnchors[h];
        _stack(c, a.$1, a.$2, chart.planets.where((p) => p.house == h + 1).toList(), isAsc: h == 0);
        final s = northSignAnchors[h];
        _text(c, '${signOfHouse(chart.ascSign, h + 1)}', s.$1, s.$2, 2.9, line, w: FontWeight.w500);
      }
    } else {
      const cell = 98 / 4;
      for (var i = 0; i < 12; i++) {
        final sign = i + 1;
        final (col, row) = southSignCells[i];
        final x = 1 + col * cell, y = 1 + row * cell;
        c.drawRect(Rect.fromLTWH(x * _k, y * _k, cell * _k, cell * _k), thin);
        if (sign == chart.ascSign) {
          c.drawLine(o(x, y + 7), o(x + 7, y), Paint()..color = asc..strokeWidth = 0.8 * _k);
        }
        _text(c, signs[i].substring(0, 3), x + cell - 2.5, y + 4.5, 2.9, line, w: FontWeight.w500, align: TextAlign.right);
        _stack(c, x + cell / 2, y + cell / 2 + 2, chart.planets.where((p) => p.sign == sign).toList());
      }
      _text(c, southLabel, 50, 46, 4, ink, w: FontWeight.w500);
      _text(c, chart.nakshatra, 50, 53, 3.2, line, w: FontWeight.w400);
    }
  }

  @override
  bool shouldRepaint(_ChartPainter old) => old.chart != chart || old.line != line || old.ink != ink;
}
