import 'package:flutter/material.dart';

import '../core/copy.dart';
import '../core/models.dart';
import '../theme/theme.dart';
import '../theme/tokens.g.dart';

/// Balance as a bar, never a number, with the reset time and a buy link.
class CreditsBar extends StatelessWidget {
  const CreditsBar({super.key, required this.credits, required this.onBuy});
  final Credits credits;
  final VoidCallback onBuy;

  @override
  Widget build(BuildContext context) {
    final c = context.c;
    final state = switch (credits.state) {
      CreditState.trial => t('credits.trial'),
      CreditState.low => t('credits.low'),
      CreditState.empty => t('credits.empty'),
      CreditState.active => t('credits.label'),
    };
    final time = TimeOfDay.fromDateTime(credits.resetsAt).format(context);
    return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Row(children: [
        Text(state, style: context.text.bodyMedium?.copyWith(fontWeight: FontWeight.w600,
            color: credits.state == CreditState.empty ? c.danger : null)),
        const Spacer(),
        Text(t('credits.resets', {'TIME': time}), style: context.text.bodySmall),
      ]),
      const SizedBox(height: SideraSpace.s2),
      Semantics(
        label: t('credits.label'),
        value: '${(credits.fraction * 100).round()}%',
        child: ClipRRect(
          borderRadius: BorderRadius.circular(SideraRadius.pill),
          child: TweenAnimationBuilder<double>(
            tween: Tween(end: credits.fraction.clamp(0, 1)),
            duration: SideraMotion.slow,
            builder: (_, v, _) => LinearProgressIndicator(
              value: v, minHeight: 6, backgroundColor: c.ink.withValues(alpha: 0.14),
              color: credits.state == CreditState.low ? c.accentStrong : c.accent,
            ),
          ),
        ),
      ),
      TextButton(
        onPressed: onBuy,
        style: TextButton.styleFrom(padding: EdgeInsets.zero, minimumSize: const Size(0, 36), tapTargetSize: MaterialTapTargetSize.shrinkWrap),
        child: Text(t('credits.buy'), style: const TextStyle(decoration: TextDecoration.underline)),
      ),
    ]);
  }
}
