import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:url_launcher/url_launcher.dart';

import '../core/constants.dart';
import '../theme/theme.dart';
import '../theme/tokens.g.dart';

/// Four-point star used as the mark until a real logo exists (D8).
class StarMark extends StatelessWidget {
  const StarMark({super.key, this.size = 18, this.color});
  final double size;
  final Color? color;
  @override
  Widget build(BuildContext context) =>
      CustomPaint(size: Size.square(size), painter: _StarPainter(color ?? context.c.accentStrong));
}

class _StarPainter extends CustomPainter {
  _StarPainter(this.color);
  final Color color;
  @override
  void paint(Canvas canvas, Size s) {
    final w = s.width, h = s.height;
    final p = Path()
      ..moveTo(w / 2, 0)
      ..quadraticBezierTo(w * 0.53, h * 0.47, w, h / 2)
      ..quadraticBezierTo(w * 0.53, h * 0.53, w / 2, h)
      ..quadraticBezierTo(w * 0.47, h * 0.53, 0, h / 2)
      ..quadraticBezierTo(w * 0.47, h * 0.47, w / 2, 0)
      ..close();
    canvas.drawPath(p, Paint()..color = color);
  }

  @override
  bool shouldRepaint(_StarPainter old) => old.color != color;
}

class Wordmark extends StatelessWidget {
  const Wordmark({super.key});
  @override
  Widget build(BuildContext context) => Row(mainAxisSize: MainAxisSize.min, children: [
        const StarMark(),
        const SizedBox(width: 8),
        Text('Sidera', style: context.text.titleLarge?.copyWith(fontWeight: FontWeight.w600)),
      ]);
}

class WhatsAppMark extends StatelessWidget {
  const WhatsAppMark({super.key, this.size = 20});
  final double size;
  @override
  Widget build(BuildContext context) => SvgPicture.string(whatsappSvg, width: size, height: size);
}

Future<void> openUrl(String url) => launchUrl(Uri.parse(url), mode: LaunchMode.externalApplication);

/// A rounded surface block, the one card style for tiles.
class Tile extends StatelessWidget {
  const Tile({super.key, required this.child, this.padding = const EdgeInsets.all(SideraSpace.s5), this.dark = false});
  final Widget child;
  final EdgeInsets padding;
  final bool dark;
  @override
  Widget build(BuildContext context) => Container(
        width: double.infinity,
        padding: padding,
        decoration: BoxDecoration(color: dark ? context.c.card : context.c.surface, borderRadius: BorderRadius.circular(SideraRadius.lg)),
        child: DefaultTextStyle.merge(style: TextStyle(color: dark ? context.c.cardInk : null), child: child),
      );
}

/// Small uppercase label.
class Label extends StatelessWidget {
  const Label(this.text, {super.key, this.color});
  final String text;
  final Color? color;
  @override
  Widget build(BuildContext context) =>
      Text(text.toUpperCase(), style: context.text.labelSmall?.copyWith(color: color ?? context.c.inkMuted));
}

/// Selectable pill (interests, day part, suggestions, incognito). One style everywhere.
class Pill extends StatelessWidget {
  const Pill({super.key, required this.label, required this.onTap, this.selected = false, this.icon});
  final String label;
  final VoidCallback onTap;
  final bool selected;
  final IconData? icon;
  @override
  Widget build(BuildContext context) {
    final c = context.c;
    final fg = selected ? c.cardInk : c.ink;
    return Semantics(
      button: true,
      selected: selected,
      child: Material(
        color: selected ? c.card : Colors.transparent,
        shape: StadiumBorder(side: BorderSide(color: selected ? c.card : c.ink.withValues(alpha: 0.24))),
        child: InkWell(
          onTap: onTap,
          customBorder: const StadiumBorder(),
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: SideraSpace.s4, vertical: 10),
            child: Row(mainAxisSize: MainAxisSize.min, children: [
              if (icon != null) ...[Icon(icon, size: 18, color: fg), const SizedBox(width: 6)],
              Text(label, style: context.text.bodyMedium?.copyWith(color: fg, fontWeight: FontWeight.w500)),
            ]),
          ),
        ),
      ),
    );
  }
}
