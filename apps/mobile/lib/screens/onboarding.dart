import 'dart:async';

import 'package:flutter/material.dart';

import '../core/copy.dart';
import '../core/models.dart';
import '../core/rules.dart';
import '../core/session.dart';
import '../theme/theme.dart';
import '../theme/tokens.g.dart';
import '../widgets/birth_chart.dart';
import '../widgets/common.dart';

const _order = OnboardingStep.values;

/// Same steps as the WhatsApp Flow form. Each step saves on Continue, so it resumes where it stopped.
class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({super.key});
  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  late OnboardingStep _step = context.session.me!.step;
  bool _saving = false;

  // Field state, prefilled from the saved profile.
  late final Profile _p = context.session.me!.profile;
  bool _terms = false;
  late bool _memory = _p.consentMemory ?? true;
  late final _name = TextEditingController(text: _p.name ?? '');
  late DateTime? _dob = _p.birthDate;
  String? _dobError;
  late bool? _knowsTime = _p.birthTime != null ? true : (_p.birthDayPart != null ? false : null);
  late TimeOfDay? _time = _parseTime(_p.birthTime);
  late DayPart? _part = _p.birthDayPart;
  final _placeCtrl = TextEditingController();
  List<Place> _results = [];
  late Place? _place = _p.place;
  Timer? _debounce;
  late final Set<Interest> _interests = {..._p.interests};
  late final _email = TextEditingController(text: _p.backupEmail ?? '');

  static TimeOfDay? _parseTime(String? s) {
    if (s == null) return null;
    final parts = s.split(':');
    return TimeOfDay(hour: int.parse(parts[0]), minute: int.parse(parts[1]));
  }

  @override
  void initState() {
    super.initState();
    _placeCtrl.text = _place?.name ?? '';
  }

  @override
  void dispose() {
    _debounce?.cancel();
    _name.dispose();
    _placeCtrl.dispose();
    _email.dispose();
    super.dispose();
  }

  Future<void> _save(OnboardingStep next, {
    String? name, DateTime? birthDate, String? birthTime, DayPart? birthDayPart, Place? place,
    List<Interest>? interests, String? backupEmail, bool? consentMemory,
  }) async {
    setState(() => _saving = true);
    final m = await context.api.saveProfile(step: next, name: name, birthDate: birthDate, birthTime: birthTime,
        birthDayPart: birthDayPart, place: place, interests: interests, backupEmail: backupEmail, consentMemory: consentMemory);
    if (!mounted) return;
    setState(() { _step = next; _saving = false; });
    if (next != OnboardingStep.done) context.session.setMe(m);
  }

  Future<void> _pickDob() async {
    final now = DateTime.now();
    final d = await showDatePicker(context: context, initialDate: _dob ?? DateTime(now.year - 25), firstDate: DateTime(1900), lastDate: now);
    if (d == null) return;
    final err = checkBirthDate(d.year, d.month, d.day);
    setState(() { _dob = d; _dobError = err == null ? null : (err == DobError.future ? t('onboarding.dobFuture') : t('onboarding.dobInvalid')); });
  }

  Future<void> _pickTime() async {
    final v = await showTimePicker(context: context, initialTime: _time ?? const TimeOfDay(hour: 12, minute: 0));
    if (v != null) setState(() => _time = v);
  }

  void _searchPlace(String q) {
    setState(() => _place = null);
    _debounce?.cancel();
    _debounce = Timer(const Duration(milliseconds: 200), () async {
      final r = await context.api.places(q);
      if (mounted) setState(() => _results = r);
    });
  }

  @override
  Widget build(BuildContext context) {
    final idx = _order.indexOf(_step);
    final total = _order.length - 1;
    final done = _step == OnboardingStep.done;
    return Scaffold(
      body: SafeArea(
        child: Column(children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(SideraSpace.s4, SideraSpace.s3, SideraSpace.s6, 0),
            child: Row(children: [
              if (idx > 0 && !done)
                IconButton(onPressed: () => setState(() => _step = _order[idx - 1]), icon: const Icon(Icons.arrow_back), tooltip: t('onboarding.back'))
              else
                const Padding(padding: EdgeInsets.only(left: 8), child: Wordmark()),
              const Spacer(),
              if (!done) Text(t('onboarding.progress', {'N': idx + 1, 'TOTAL': total}), style: context.text.bodySmall),
            ]),
          ),
          if (!done)
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: SideraSpace.s6, vertical: SideraSpace.s3),
              child: ClipRRect(
                borderRadius: BorderRadius.circular(4),
                child: TweenAnimationBuilder<double>(
                  tween: Tween(end: (idx + 1) / total),
                  duration: SideraMotion.slow,
                  builder: (_, v, _) => LinearProgressIndicator(value: v, minHeight: 4, color: context.c.accent, backgroundColor: context.c.ink.withValues(alpha: 0.12)),
                ),
              ),
            ),
          Expanded(
            child: AnimatedSwitcher(
              duration: SideraMotion.base,
              child: ListView(
                key: ValueKey(_step),
                padding: const EdgeInsets.fromLTRB(SideraSpace.s6, SideraSpace.s6, SideraSpace.s6, SideraSpace.s8),
                children: _stepBody(context),
              ),
            ),
          ),
        ]),
      ),
    );
  }

  List<Widget> _stepBody(BuildContext context) {
    final c = context.c;
    Widget h(String key) => Padding(padding: const EdgeInsets.only(bottom: SideraSpace.s3), child: Text(t(key), style: context.text.headlineMedium));
    Widget lead(String key) => Padding(padding: const EdgeInsets.only(bottom: SideraSpace.s6), child: Text(t(key), style: context.text.bodyLarge?.copyWith(color: c.inkMuted)));
    Widget next(VoidCallback? onTap, {String key = 'onboarding.next'}) =>
        Padding(padding: const EdgeInsets.only(top: SideraSpace.s6), child: FilledButton(onPressed: _saving ? null : onTap, child: Text(t(key))));
    Widget field(String label) => Padding(padding: const EdgeInsets.only(bottom: SideraSpace.s2, top: SideraSpace.s4), child: Text(t(label), style: context.text.bodyMedium?.copyWith(fontWeight: FontWeight.w500)));

    switch (_step) {
      case OnboardingStep.consent:
        return [
          h('onboarding.consentH'), lead('onboarding.consentLead'),
          _Check(value: _terms, onChanged: (v) => setState(() => _terms = v), title: t('onboarding.consentTerms')),
          const SizedBox(height: SideraSpace.s3),
          _Check(value: _memory, onChanged: (v) => setState(() => _memory = v), title: t('onboarding.consentMemory'), subtitle: t('onboarding.consentMemoryHint')),
          next(_terms ? () => _save(OnboardingStep.name, consentMemory: _memory) : null),
        ];
      case OnboardingStep.name:
        final dobText = _dob == null ? '' : MaterialLocalizations.of(context).formatMediumDate(_dob!);
        return [
          h('onboarding.nameH'),
          field('onboarding.nameLabel'),
          TextField(controller: _name, autofocus: true, textCapitalization: TextCapitalization.words, onChanged: (_) => setState(() {})),
          field('onboarding.dobLabel'),
          InkWell(
            onTap: _pickDob,
            borderRadius: BorderRadius.circular(SideraRadius.md),
            child: InputDecorator(
              decoration: InputDecoration(errorText: _dobError, suffixIcon: const Icon(Icons.calendar_today_outlined, size: 20)),
              child: Text(dobText.isEmpty ? ' ' : dobText, style: const TextStyle(fontSize: 17)),
            ),
          ),
          next(_name.text.trim().isNotEmpty && _dob != null && _dobError == null
              ? () => _save(OnboardingStep.birthTime, name: _name.text.trim(), birthDate: _dob) : null),
        ];
      case OnboardingStep.birthTime:
        final ok = _knowsTime == true ? _time != null : (_knowsTime == false && _part != null);
        return [
          h('onboarding.timeH'),
          const SizedBox(height: SideraSpace.s3),
          Row(children: [
            Expanded(child: _Choice(label: t('onboarding.timeYes'), selected: _knowsTime == true, onTap: () => setState(() => _knowsTime = true))),
            const SizedBox(width: SideraSpace.s3),
            Expanded(child: _Choice(label: t('onboarding.timeNo'), selected: _knowsTime == false, onTap: () => setState(() => _knowsTime = false))),
          ]),
          if (_knowsTime == true) ...[
            field('onboarding.timeLabel'),
            InkWell(
              onTap: _pickTime,
              borderRadius: BorderRadius.circular(SideraRadius.md),
              child: InputDecorator(
                decoration: const InputDecoration(suffixIcon: Icon(Icons.schedule, size: 20)),
                child: Text(_time?.format(context) ?? ' ', style: const TextStyle(fontSize: 17)),
              ),
            ),
          ],
          if (_knowsTime == false) ...[
            field('onboarding.dayPartH'),
            Wrap(spacing: SideraSpace.s2, runSpacing: SideraSpace.s2, children: [
              for (final p in DayPart.values) Pill(label: t('onboarding.dayParts.${p.name}'), selected: _part == p, onTap: () => setState(() => _part = p)),
            ]),
          ],
          next(ok ? () => _knowsTime!
              ? _save(OnboardingStep.place, birthTime: '${_time!.hour.toString().padLeft(2, '0')}:${_time!.minute.toString().padLeft(2, '0')}')
              : _save(OnboardingStep.place, birthDayPart: _part) : null),
        ];
      case OnboardingStep.place:
        return [
          h('onboarding.placeH'),
          field('onboarding.placeLabel'),
          TextField(controller: _placeCtrl, autofocus: true, onChanged: _searchPlace, decoration: InputDecoration(helperText: t('onboarding.placeHint'))),
          if (_place == null && _results.isNotEmpty) ...[
            const SizedBox(height: SideraSpace.s3),
            for (final p in _results)
              Padding(
                padding: const EdgeInsets.only(bottom: 6),
                child: Material(
                  color: c.surface,
                  borderRadius: BorderRadius.circular(SideraRadius.md),
                  child: ListTile(
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(SideraRadius.md)),
                    title: Text(p.name, style: context.text.titleMedium),
                    subtitle: Text(p.region, style: context.text.bodySmall),
                    onTap: () => setState(() { _place = p; _placeCtrl.text = p.name; _results = []; }),
                  ),
                ),
              ),
          ],
          next(_place != null ? () => _save(OnboardingStep.interests, place: _place) : null),
        ];
      case OnboardingStep.interests:
        return [
          h('onboarding.interestsH'), lead('onboarding.interestsLead'),
          Wrap(spacing: SideraSpace.s2, runSpacing: SideraSpace.s2, children: [
            for (final i in Interest.values)
              Pill(label: t('onboarding.interests.${i.name}'), selected: _interests.contains(i),
                  onTap: () => setState(() => _interests.contains(i) ? _interests.remove(i) : _interests.add(i))),
          ]),
          next(() => _save(OnboardingStep.email, interests: _interests.toList())),
        ];
      case OnboardingStep.email:
        final valid = RegExp(r'^[^\s@]+@[^\s@]+\.[^\s@]+$').hasMatch(_email.text);
        return [
          h('onboarding.emailH'), lead('onboarding.emailLead'),
          field('onboarding.emailLabel'),
          TextField(controller: _email, keyboardType: TextInputType.emailAddress, autofillHints: const [AutofillHints.email], onChanged: (_) => setState(() {})),
          next(valid ? () => _save(OnboardingStep.done, backupEmail: _email.text.trim()) : null),
          const SizedBox(height: SideraSpace.s3),
          OutlinedButton(onPressed: _saving ? null : () => _save(OnboardingStep.done), child: Text(t('onboarding.skip'))),
        ];
      case OnboardingStep.done:
        return [
          h('onboarding.doneH'),
          const SizedBox(height: SideraSpace.s3),
          FutureBuilder(
            future: context.api.chart(),
            builder: (context, snap) => Tile(
              padding: const EdgeInsets.all(SideraSpace.s6),
              child: snap.hasData ? BirthChart(chart: snap.data!) : const AspectRatio(aspectRatio: 1),
            ),
          ),
          const SizedBox(height: SideraSpace.s5),
          Text(t('onboarding.doneLead'), style: context.text.bodyLarge?.copyWith(color: c.inkMuted)),
          const SizedBox(height: SideraSpace.s6),
          FilledButton(onPressed: () { context.session.startTab = 1; context.session.refresh(); }, child: Text(t('onboarding.doneChat'))),
          const SizedBox(height: SideraSpace.s3),
          OutlinedButton(onPressed: () => context.session.refresh(), child: Text(t('onboarding.doneQuiz'))),
        ];
    }
  }
}

class _Check extends StatelessWidget {
  const _Check({required this.value, required this.onChanged, required this.title, this.subtitle});
  final bool value;
  final ValueChanged<bool> onChanged;
  final String title;
  final String? subtitle;
  @override
  Widget build(BuildContext context) => Material(
        color: context.c.surface,
        borderRadius: BorderRadius.circular(SideraRadius.md),
        child: CheckboxListTile(
          value: value,
          onChanged: (v) => onChanged(v ?? false),
          controlAffinity: ListTileControlAffinity.leading,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(SideraRadius.md)),
          title: Text(title, style: context.text.bodyLarge),
          subtitle: subtitle == null ? null : Text(subtitle!, style: context.text.bodySmall),
        ),
      );
}

class _Choice extends StatelessWidget {
  const _Choice({required this.label, required this.selected, required this.onTap});
  final String label;
  final bool selected;
  final VoidCallback onTap;
  @override
  Widget build(BuildContext context) {
    final c = context.c;
    return Semantics(
      selected: selected,
      button: true,
      child: AnimatedContainer(
        duration: SideraMotion.fast,
        decoration: BoxDecoration(
          color: selected ? c.card : Colors.transparent,
          borderRadius: BorderRadius.circular(SideraRadius.pill),
          border: Border.all(color: selected ? c.card : c.ink.withValues(alpha: 0.24)),
        ),
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(SideraRadius.pill),
          child: Padding(
            padding: const EdgeInsets.symmetric(vertical: 14),
            child: Center(child: Text(label, style: context.text.titleMedium?.copyWith(color: selected ? c.cardInk : c.ink))),
          ),
        ),
      ),
    );
  }
}
