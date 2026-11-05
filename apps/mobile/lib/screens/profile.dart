import 'package:flutter/material.dart';

import '../core/constants.dart';
import '../core/copy.dart';
import '../core/models.dart';
import '../core/session.dart';
import '../theme/theme.dart';
import '../theme/tokens.g.dart';
import '../widgets/common.dart';
import '../widgets/credits_bar.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key, required this.onBuy});
  final VoidCallback onBuy;
  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  List<MemoryItem>? _memory;
  bool _confirmDelete = false;

  @override
  void initState() {
    super.initState();
    context.api.memory().then((m) => mounted ? setState(() => _memory = m) : null);
  }

  @override
  Widget build(BuildContext context) {
    final s = context.session;
    final me = s.me!;
    final c = context.c;
    final phone = me.phone.replaceFirstMapped(RegExp(r'^\+91(\d{5})(\d{5})$'), (m) => '+91 ${m[1]} ${m[2]}');

    return SafeArea(
      bottom: false,
      child: ListView(
        padding: const EdgeInsets.fromLTRB(SideraSpace.s4, SideraSpace.s5, SideraSpace.s4, SideraSpace.s8),
        children: [
          Row(children: [
            CircleAvatar(radius: 28, backgroundColor: c.card, foregroundColor: c.cardInk,
                child: Text((me.name ?? '?').characters.first, style: context.text.titleLarge?.copyWith(color: c.cardInk))),
            const SizedBox(width: SideraSpace.s4),
            Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text(me.name ?? '', style: context.text.headlineSmall),
              Text(phone, style: context.text.bodySmall),
            ])),
          ]),
          const SizedBox(height: SideraSpace.s5),
          Tile(child: CreditsBar(credits: me.credits, onBuy: widget.onBuy)),
          _Section(t('nav.profile'), [
            _Row(title: t('profile.birth'), subtitle: t('profile.birthNote'), onTap: () {}),
            _Row(title: t('profile.language'), trailing: _Seg<Language>(
              values: Language.values, selected: me.language, label: (l) => t('profile.languages.${l.name}'),
              onSelect: (l) async => s.setMe(await s.api.saveProfile(language: l)))),
            _Row(title: t('profile.chartStyle'), trailing: _Seg<ChartStyle>(
              values: ChartStyle.values, selected: me.chartStyle, label: (v) => t('home.styles.${v.name}').split(' ').first,
              onSelect: (v) async => s.setMe(await s.api.saveProfile(chartStyle: v)))),
            _Row(title: t('profile.theme'), trailing: _Seg<ThemeMode>(
              values: ThemeMode.values, selected: s.themeMode, label: (m) => t('profile.themes.${m.name}').split(' ').first,
              onSelect: s.setTheme)),
          ]),
          _Section(t('profile.memory'), [
            if (_memory != null && _memory!.isEmpty) _Row(title: t('profile.memoryEmpty')),
            for (final m in _memory ?? <MemoryItem>[])
              _Row(title: m.text, trailing: TextButton(
                onPressed: () async { await s.api.forget(m.id); setState(() => _memory = _memory!.where((x) => x.id != m.id).toList()); },
                child: Text(t('profile.delete'), style: const TextStyle(decoration: TextDecoration.underline)),
              )),
            _Row(title: t('profile.clearChat'), subtitle: t('profile.clearChatNote'), onTap: () => s.api.clearChat()),
          ]),
          _Section(t('profile.help'), [
            _Row(title: t('profile.human'), onTap: () => openUrl('mailto:$supportEmail'), chevron: true),
            _Row(title: t('profile.changeNumber'), onTap: s.logout, chevron: true),
            _Row(title: t('profile.logout'), onTap: s.logout),
            if (_confirmDelete)
              _Row(title: t('profile.deleteAccountNote'), trailing: FilledButton(
                style: FilledButton.styleFrom(minimumSize: const Size(0, 38)),
                onPressed: () async { await s.api.deleteAccount(); await s.logout(); },
                child: Text(t('profile.deleteAccount')),
              ))
            else
              _Row(title: t('profile.deleteAccount'), danger: true, onTap: () => setState(() => _confirmDelete = true)),
          ]),
        ],
      ),
    );
  }
}

class _Section extends StatelessWidget {
  const _Section(this.title, this.rows);
  final String title;
  final List<Widget> rows;
  @override
  Widget build(BuildContext context) => Padding(
        padding: const EdgeInsets.only(top: SideraSpace.s6),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Padding(padding: const EdgeInsets.only(left: 4, bottom: SideraSpace.s2), child: Label(title)),
          Container(
            clipBehavior: Clip.antiAlias,
            decoration: BoxDecoration(color: context.c.surface, borderRadius: BorderRadius.circular(SideraRadius.lg)),
            child: Column(children: [
              for (final (i, r) in rows.indexed) ...[if (i > 0) Divider(height: 1, color: context.c.line), r],
            ]),
          ),
        ]),
      );
}

class _Row extends StatelessWidget {
  const _Row({required this.title, this.subtitle, this.trailing, this.onTap, this.chevron = false, this.danger = false});
  final String title;
  final String? subtitle;
  final Widget? trailing;
  final VoidCallback? onTap;
  final bool chevron;
  final bool danger;
  @override
  Widget build(BuildContext context) => ListTile(
        onTap: onTap,
        contentPadding: const EdgeInsets.symmetric(horizontal: SideraSpace.s5, vertical: 2),
        title: Text(title, style: context.text.bodyLarge?.copyWith(color: danger ? context.c.danger : null)),
        subtitle: subtitle == null ? null : Text(subtitle!, style: context.text.bodySmall),
        trailing: trailing ?? (chevron ? Icon(Icons.chevron_right, color: context.c.inkMuted) : null),
      );
}

class _Seg<T> extends StatelessWidget {
  const _Seg({required this.values, required this.selected, required this.label, required this.onSelect});
  final List<T> values;
  final T selected;
  final String Function(T) label;
  final ValueChanged<T> onSelect;
  @override
  Widget build(BuildContext context) {
    final c = context.c;
    return Container(
      padding: const EdgeInsets.all(3),
      decoration: BoxDecoration(color: c.bg, borderRadius: BorderRadius.circular(SideraRadius.pill), border: Border.all(color: c.line)),
      child: Row(mainAxisSize: MainAxisSize.min, children: [
        for (final v in values)
          Semantics(
            selected: v == selected,
            button: true,
            child: GestureDetector(
              onTap: () => onSelect(v),
              child: AnimatedContainer(
                duration: SideraMotion.fast,
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                decoration: BoxDecoration(color: v == selected ? c.card : Colors.transparent, borderRadius: BorderRadius.circular(SideraRadius.pill)),
                child: Text(label(v), style: context.text.bodySmall?.copyWith(fontWeight: FontWeight.w500, color: v == selected ? c.cardInk : c.ink)),
              ),
            ),
          ),
      ]),
    );
  }
}
