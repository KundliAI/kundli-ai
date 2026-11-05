import 'dart:convert';

import 'package:flutter/services.dart';

/// User-facing strings from packages/copy/en.json (copied into assets by the token build).
class Copy {
  Copy._(this._data);
  final Map<String, dynamic> _data;

  static late Copy i;

  static Future<void> load() async {
    final raw = await rootBundle.loadString('assets/copy/en.json');
    i = Copy._(jsonDecode(raw) as Map<String, dynamic>);
  }

  /// For tests.
  static void loadFrom(String json) => i = Copy._(jsonDecode(json) as Map<String, dynamic>);

  Object? _at(String path) {
    Object? cur = _data;
    for (final k in path.split('.')) {
      if (cur is Map<String, dynamic>) {
        cur = cur[k];
      } else if (cur is List<dynamic>) {
        cur = cur[int.parse(k)];
      } else {
        return null;
      }
    }
    return cur;
  }

  String s(String path, [Map<String, Object> vars = const {}]) {
    final v = _at(path);
    if (v is! String) throw ArgumentError('missing copy: $path');
    return fill(v, vars);
  }

  List<String> list(String path) => (_at(path) as List<dynamic>).cast<String>();
}

/// Replaces {KEY} placeholders. Unknown keys stay as they are.
String fill(String template, Map<String, Object> vars) =>
    template.replaceAllMapped(RegExp(r'\{([A-Z_]+)\}'), (m) => vars[m[1]]?.toString() ?? m[0]!);

String t(String path, [Map<String, Object> vars = const {}]) => Copy.i.s(path, vars);
