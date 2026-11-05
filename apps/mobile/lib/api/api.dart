import '../core/models.dart';

/// Everything the screens need from the backend. Matches packages/api/openapi.yaml.
abstract class SideraApi {
  Future<LoginChallenge> startLogin(String phone, {String? ref});
  Future<LoginState> loginStatus(String challengeId);
  Future<void> logout();
  Future<Me?> me();
  Future<Me> saveProfile({
    OnboardingStep? step, String? name, DateTime? birthDate, String? birthTime, DayPart? birthDayPart,
    Place? place, List<Interest>? interests, String? backupEmail, bool? consentMemory,
    Language? language, ChartStyle? chartStyle, bool? questionnaireDone,
  });
  Future<List<Place>> places(String q);
  Future<Chart> chart();
  Future<DailyCard> dailyCard();
  Future<List<ChatMessage>> messages();
  Future<ChatReply> ask(String text, {bool incognito = false});
  Future<void> clearChat();
  Future<List<MemoryItem>> memory();
  Future<void> forget(String id);
  Future<List<CreditPack>> packs();
  Future<Order> createOrder(String packId);
  Future<Order> order(String orderId);
  Future<List<Friend>> friends();
  Future<Friend> addFriend(String name, DateTime birthDate);
  Future<Referral> referral();
  Future<void> deleteAccount();
}
