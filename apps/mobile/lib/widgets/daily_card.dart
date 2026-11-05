import 'dart:math';

import 'package:flutter/material.dart';

import '../core/copy.dart';
import '../core/models.dart';
import '../theme/theme.dart';
import '../theme/tokens.g.dart';
import 'common.dart';

/// D6: text-led, tap to flip. Locked cards show one line, a blur and a buy button.
class DailyCardView extends StatefulWidget {
  const DailyCardView({super.key, required this.card, this.onShare, required this.onBuy});
  final DailyCard card;
  final VoidCallback? onShare;
  final VoidCallback onBuy;
  @override
  State<DailyCardView> createState() => _DailyCardViewState();
}

class _DailyCardViewState extends State<DailyCardView> {
  bool _flipped = false;

  @override
  Widget build(BuildContext context) {
    final c = context.c;
    final card = widget.card;
    final reduce = MediaQuery.of(context).disableAnimations;
    final front = _Face(children: [
      Label('${card.weekday} · ${card.tithi}', color: c.cardMuted),
      const SizedBox(height: SideraSpace.s2),
      Text(card.nakshatra, style: context.text.headlineMedium?.copyWith(color: c.cardGold, fontSize: 38)),
      const SizedBox(height: SideraSpace.s1),
      Text(card.line, style: context.text.bodyLarge?.copyWith(color: c.cardInk, fontSize: 17)),
      if (!card.locked) ...[
        const SizedBox(height: SideraSpace.s4),
        Text(t('home.dailyFlip'), style: context.text.bodySmall?.copyWith(color: c.cardMuted)),
      ],
    ]);
    final back = _Face(children: [
      Text(card.detail ?? '', style: context.text.bodyLarge?.copyWith(color: c.cardInk)),
      const SizedBox(height: SideraSpace.s5),
      Wrap(spacing: SideraSpace.s8, runSpacing: SideraSpace.s3, children: [
        _Fact(t('home.goodHours'), card.goodHours ?? ''),
        _Fact(t('home.luckyColour'), card.luckyColour ?? ''),
      ]),
    ]);

    return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Semantics(
        button: !card.locked,
        label: card.locked ? null : t('home.dailyFlip'),
        child: GestureDetector(
          onTap: card.locked ? null : () => setState(() => _flipped = !_flipped),
          child: TweenAnimationBuilder<double>(
            tween: Tween(end: _flipped ? 1 : 0),
            duration: reduce ? Duration.zero : SideraMotion.slow,
            curve: Curves.easeOutCubic,
            builder: (context, v, _) {
              final showBack = v > 0.5;
              return Transform(
                alignment: Alignment.center,
                transform: Matrix4.identity()..setEntry(3, 2, 0.0012)..rotateY(v * pi),
                child: Container(
                  constraints: const BoxConstraints(minHeight: 210),
                  width: double.infinity,
                  decoration: BoxDecoration(color: c.card, borderRadius: BorderRadius.circular(SideraRadius.lg)),
                  child: showBack ? Transform(alignment: Alignment.center, transform: Matrix4.rotationY(pi), child: back) : front,
                ),
              );
            },
          ),
        ),
      ),
      const SizedBox(height: SideraSpace.s3),
      if (card.locked)
        FilledButton.icon(onPressed: widget.onBuy, icon: const Icon(Icons.lock_outline, size: 18), label: Text(t('home.dailyLocked')))
      else if (widget.onShare != null)
        OutlinedButton.icon(
          onPressed: widget.onShare,
          style: OutlinedButton.styleFrom(minimumSize: const Size(0, 40)),
          icon: const Icon(Icons.ios_share, size: 18),
          label: Text(t('home.dailyShare')),
        ),
    ]);
  }
}

class _Face extends StatelessWidget {
  const _Face({required this.children});
  final List<Widget> children;
  @override
  Widget build(BuildContext context) => Padding(
        padding: const EdgeInsets.all(SideraSpace.s6),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, mainAxisSize: MainAxisSize.min, children: children),
      );
}

class _Fact extends StatelessWidget {
  const _Fact(this.label, this.value);
  final String label, value;
  @override
  Widget build(BuildContext context) => Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Label(label, color: context.c.cardMuted),
        const SizedBox(height: 2),
        Text(value, style: context.text.titleMedium?.copyWith(color: context.c.cardInk)),
      ]);
}
