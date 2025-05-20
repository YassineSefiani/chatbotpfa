"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

export type Language = "en" | "fr" | "es" | "de" | "it" | "pt" | "ru" | "zh" | "ja" | "ar"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const translations = {
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.chat": "Chat",
    "nav.settings": "Settings",
    "nav.signin": "Sign In",
    "nav.signout": "Sign Out",
    "nav.profile": "Profile",
    
    // Auth
    "auth.signin": "Sign In",
    "auth.signup": "Sign Up",
    "auth.email": "Email",
    "auth.password": "Password",
    "auth.forgot": "Forgot Password?",
    "auth.noaccount": "Don't have an account?",
    "auth.haveaccount": "Already have an account?",
    
    // Chat
    "chat.placeholder": "Type your message...",
    "chat.send": "Send",
    "chat.clear": "Clear chat",
    "chat.new": "New chat",
    "chat.listening": "Listening...",
    "chat.speak": "Speak now",
    "chat.helpful": "Helpful",
    "chat.nothelpful": "Not helpful",
    "chat.copied": "Copied!",
    "chat.copieddesc": "Code copied to clipboard",
    "chat.clearconfirm": "Clear conversation?",
    "chat.clearconfirmdesc": "This will delete all messages in this conversation. This action cannot be undone.",
    "chat.cancel": "Cancel",
    "chat.clearaction": "Clear",
    "chat.fallback": "Fallback",
    "chat.fallbackwarning": "The AI service is currently operating in fallback mode due to API quota limitations. Responses will be more basic until the service is fully available.",
    "chat.dismiss": "Dismiss",
    "chat.startconversation": "Start a conversation with the AI assistant.",
    "chat.askanything": "Ask any question or just chat about your day!",
    
    // Models
    "model.select": "Select a model",
    "model.llama4maverick": "Llama 4 Maverick",
    "model.llama4maverick.desc": "Meta's latest open-source model",
    "model.deephermes3mistral": "DeepHermes 3 Mistral",
    "model.deephermes3mistral.desc": "Nous Research's advanced model",
    "model.qwen330b": "Qwen 3 30B",
    "model.qwen330b.desc": "Alibaba's powerful language model",
    
    // Language
    "language.select": "Select language",
    "language.en": "English",
    "language.fr": "French",
    "language.es": "Spanish",
    "language.de": "German",
    "language.it": "Italian",
    "language.pt": "Portuguese",
    "language.ru": "Russian",
    "language.zh": "Chinese",
    "language.ja": "Japanese",
    "language.ar": "Arabic",
  },
  fr: {
    // Navigation
    "nav.home": "Accueil",
    "nav.chat": "Chat",
    "nav.settings": "Paramètres",
    "nav.signin": "Connexion",
    "nav.signout": "Déconnexion",
    "nav.profile": "Profil",
    
    // Auth
    "auth.signin": "Connexion",
    "auth.signup": "Inscription",
    "auth.email": "Email",
    "auth.password": "Mot de passe",
    "auth.forgot": "Mot de passe oublié ?",
    "auth.noaccount": "Pas de compte ?",
    "auth.haveaccount": "Déjà un compte ?",
    
    // Chat
    "chat.placeholder": "Tapez votre message...",
    "chat.send": "Envoyer",
    "chat.clear": "Effacer la conversation",
    "chat.new": "Nouvelle conversation",
    "chat.listening": "Écoute...",
    "chat.speak": "Parlez maintenant",
    "chat.helpful": "Utile",
    "chat.nothelpful": "Pas utile",
    "chat.copied": "Copié !",
    "chat.copieddesc": "Code copié dans le presse-papiers",
    "chat.clearconfirm": "Effacer la conversation ?",
    "chat.clearconfirmdesc": "Cela supprimera tous les messages de cette conversation. Cette action ne peut pas être annulée.",
    "chat.cancel": "Annuler",
    "chat.clearaction": "Effacer",
    "chat.fallback": "Mode dégradé",
    "chat.fallbackwarning": "Le service d'IA fonctionne actuellement en mode dégradé en raison des limitations de quota d'API. Les réponses seront plus basiques jusqu'à ce que le service soit pleinement disponible.",
    "chat.dismiss": "Fermer",
    "chat.startconversation": "Commencez une conversation avec l'assistant IA.",
    "chat.askanything": "Posez n'importe quelle question ou discutez simplement de votre journée !",
    
    // Models
    "model.select": "Sélectionner un modèle",
    "model.llama4maverick": "Llama 4 Maverick",
    "model.llama4maverick.desc": "Dernier modèle open-source de Meta",
    "model.deephermes3mistral": "DeepHermes 3 Mistral",
    "model.deephermes3mistral.desc": "Modèle avancé de Nous Research",
    "model.qwen330b": "Qwen 3 30B",
    "model.qwen330b.desc": "Puissant modèle de langage d'Alibaba",
    
    // Language
    "language.select": "Sélectionner la langue",
    "language.en": "Anglais",
    "language.fr": "Français",
    "language.es": "Espagnol",
    "language.de": "Allemand",
    "language.it": "Italien",
    "language.pt": "Portugais",
    "language.ru": "Russe",
    "language.zh": "Chinois",
    "language.ja": "Japonais",
    "language.ar": "Arabe",
  },
  es: {
    // Navigation
    "nav.home": "Inicio",
    "nav.chat": "Chat",
    "nav.settings": "Ajustes",
    "nav.signin": "Iniciar sesión",
    "nav.signout": "Cerrar sesión",
    "nav.profile": "Perfil",
    
    // Auth
    "auth.signin": "Iniciar sesión",
    "auth.signup": "Registrarse",
    "auth.email": "Correo electrónico",
    "auth.password": "Contraseña",
    "auth.forgot": "¿Olvidaste tu contraseña?",
    "auth.noaccount": "¿No tienes cuenta?",
    "auth.haveaccount": "¿Ya tienes cuenta?",
    
    // Chat
    "chat.placeholder": "Escribe tu mensaje...",
    "chat.send": "Enviar",
    "chat.clear": "Limpiar chat",
    "chat.new": "Nuevo chat",
    "chat.listening": "Escuchando...",
    "chat.speak": "Habla ahora",
    "chat.helpful": "Útil",
    "chat.nothelpful": "No útil",
    "chat.copied": "¡Copiado!",
    "chat.copieddesc": "Código copiado al portapapeles",
    "chat.clearconfirm": "¿Limpiar conversación?",
    "chat.clearconfirmdesc": "Esto eliminará todos los mensajes de esta conversación. Esta acción no se puede deshacer.",
    "chat.cancel": "Cancelar",
    "chat.clearaction": "Limpiar",
    "chat.fallback": "Modo alternativo",
    "chat.fallbackwarning": "El servicio de IA está funcionando actualmente en modo alternativo debido a las limitaciones de cuota de API. Las respuestas serán más básicas hasta que el servicio esté completamente disponible.",
    "chat.dismiss": "Descartar",
    "chat.startconversation": "Inicia una conversación con el asistente de IA.",
    "chat.askanything": "¡Haz cualquier pregunta o simplemente charla sobre tu día!",
    
    // Models
    "model.select": "Seleccionar modelo",
    "model.llama4maverick": "Llama 4 Maverick",
    "model.llama4maverick.desc": "Último modelo open-source de Meta",
    "model.deephermes3mistral": "DeepHermes 3 Mistral",
    "model.deephermes3mistral.desc": "Modelo avanzado de Nous Research",
    "model.qwen330b": "Qwen 3 30B",
    "model.qwen330b.desc": "Potente modelo de lenguaje de Alibaba",
    
    // Language
    "language.select": "Seleccionar idioma",
    "language.en": "Inglés",
    "language.fr": "Francés",
    "language.es": "Español",
    "language.de": "Alemán",
    "language.it": "Italiano",
    "language.pt": "Portugués",
    "language.ru": "Ruso",
    "language.zh": "Chino",
    "language.ja": "Japonés",
    "language.ar": "Árabe",
  },
  de: {
    // Navigation
    "nav.home": "Startseite",
    "nav.chat": "Chat",
    "nav.settings": "Einstellungen",
    "nav.signin": "Anmelden",
    "nav.signout": "Abmelden",
    "nav.profile": "Profil",
    
    // Auth
    "auth.signin": "Anmelden",
    "auth.signup": "Registrieren",
    "auth.email": "E-Mail",
    "auth.password": "Passwort",
    "auth.forgot": "Passwort vergessen?",
    "auth.noaccount": "Kein Konto?",
    "auth.haveaccount": "Bereits ein Konto?",
    
    // Chat
    "chat.placeholder": "Geben Sie Ihre Nachricht ein...",
    "chat.send": "Senden",
    "chat.clear": "Chat löschen",
    "chat.new": "Neuer Chat",
    "chat.listening": "Höre zu...",
    "chat.speak": "Jetzt sprechen",
    "chat.helpful": "Hilfreich",
    "chat.nothelpful": "Nicht hilfreich",
    "chat.copied": "Kopiert!",
    "chat.copieddesc": "Code in die Zwischenablage kopiert",
    "chat.clearconfirm": "Konversation löschen?",
    "chat.clearconfirmdesc": "Dies wird alle Nachrichten in dieser Konversation löschen. Diese Aktion kann nicht rückgängig gemacht werden.",
    "chat.cancel": "Abbrechen",
    "chat.clearaction": "Löschen",
    "chat.fallback": "Fallback",
    "chat.fallbackwarning": "Der KI-Dienst arbeitet derzeit im Fallback-Modus aufgrund von API-Kontingentbeschränkungen. Die Antworten werden einfacher sein, bis der Dienst vollständig verfügbar ist.",
    "chat.dismiss": "Schließen",
    "chat.startconversation": "Starten Sie ein Gespräch mit dem KI-Assistenten.",
    "chat.askanything": "Stellen Sie eine Frage oder plaudern Sie einfach über Ihren Tag!",
    
    // Models
    "model.select": "Modell auswählen",
    "model.llama4maverick": "Llama 4 Maverick",
    "model.llama4maverick.desc": "Metas neuestes Open-Source-Modell",
    "model.deephermes3mistral": "DeepHermes 3 Mistral",
    "model.deephermes3mistral.desc": "Fortschrittliches Modell von Nous Research",
    "model.qwen330b": "Qwen 3 30B",
    "model.qwen330b.desc": "Leistungsstarkes Sprachmodell von Alibaba",
    
    // Language
    "language.select": "Sprache auswählen",
    "language.en": "Englisch",
    "language.fr": "Französisch",
    "language.es": "Spanisch",
    "language.de": "Deutsch",
    "language.it": "Italienisch",
    "language.pt": "Portugiesisch",
    "language.ru": "Russisch",
    "language.zh": "Chinesisch",
    "language.ja": "Japanisch",
    "language.ar": "Arabisch",
  },
  it: {
    // Navigation
    "nav.home": "Home",
    "nav.chat": "Chat",
    "nav.settings": "Impostazioni",
    "nav.signin": "Accedi",
    "nav.signout": "Esci",
    "nav.profile": "Profilo",
    
    // Auth
    "auth.signin": "Accedi",
    "auth.signup": "Registrati",
    "auth.email": "Email",
    "auth.password": "Password",
    "auth.forgot": "Password dimenticata?",
    "auth.noaccount": "Non hai un account?",
    "auth.haveaccount": "Hai già un account?",
    
    // Chat
    "chat.placeholder": "Scrivi il tuo messaggio...",
    "chat.send": "Invia",
    "chat.clear": "Cancella chat",
    "chat.new": "Nuova chat",
    "chat.listening": "In ascolto...",
    "chat.speak": "Parla ora",
    "chat.helpful": "Utile",
    "chat.nothelpful": "Non utile",
    "chat.copied": "Copiato!",
    "chat.copieddesc": "Codice copiato negli appunti",
    "chat.clearconfirm": "Cancellare la conversazione?",
    "chat.clearconfirmdesc": "Questo eliminerà tutti i messaggi in questa conversazione. Questa azione non può essere annullata.",
    "chat.cancel": "Annulla",
    "chat.clearaction": "Cancella",
    "chat.fallback": "Modalità di riserva",
    "chat.fallbackwarning": "Il servizio AI sta attualmente funzionando in modalità di riserva a causa delle limitazioni della quota API. Le risposte saranno più basilari fino a quando il servizio non sarà completamente disponibile.",
    "chat.dismiss": "Chiudi",
    "chat.startconversation": "Inizia una conversazione con l'assistente AI.",
    "chat.askanything": "Fai una domanda o chiacchiera semplicemente della tua giornata!",
    
    // Models
    "model.select": "Seleziona un modello",
    "model.llama4maverick": "Llama 4 Maverick",
    "model.llama4maverick.desc": "Ultimo modello open-source di Meta",
    "model.deephermes3mistral": "DeepHermes 3 Mistral",
    "model.deephermes3mistral.desc": "Modello avanzato di Nous Research",
    "model.qwen330b": "Qwen 3 30B",
    "model.qwen330b.desc": "Potente modello linguistico di Alibaba",
    
    // Language
    "language.select": "Seleziona lingua",
    "language.en": "Inglese",
    "language.fr": "Francese",
    "language.es": "Spagnolo",
    "language.de": "Tedesco",
    "language.it": "Italiano",
    "language.pt": "Portoghese",
    "language.ru": "Russo",
    "language.zh": "Cinese",
    "language.ja": "Giapponese",
    "language.ar": "Arabo",
  },
  pt: {
    // Navigation
    "nav.home": "Início",
    "nav.chat": "Chat",
    "nav.settings": "Configurações",
    "nav.signin": "Entrar",
    "nav.signout": "Sair",
    "nav.profile": "Perfil",
    
    // Auth
    "auth.signin": "Entrar",
    "auth.signup": "Cadastrar",
    "auth.email": "Email",
    "auth.password": "Senha",
    "auth.forgot": "Esqueceu a senha?",
    "auth.noaccount": "Não tem uma conta?",
    "auth.haveaccount": "Já tem uma conta?",
    
    // Chat
    "chat.placeholder": "Digite sua mensagem...",
    "chat.send": "Enviar",
    "chat.clear": "Limpar chat",
    "chat.new": "Novo chat",
    "chat.listening": "Ouvindo...",
    "chat.speak": "Fale agora",
    "chat.helpful": "Útil",
    "chat.nothelpful": "Não útil",
    "chat.copied": "Copiado!",
    "chat.copieddesc": "Código copiado para a área de transferência",
    "chat.clearconfirm": "Limpar conversa?",
    "chat.clearconfirmdesc": "Isso excluirá todas as mensagens nesta conversa. Esta ação não pode ser desfeita.",
    "chat.cancel": "Cancelar",
    "chat.clearaction": "Limpar",
    "chat.fallback": "Modo alternativo",
    "chat.fallbackwarning": "O serviço de IA está atualmente operando em modo alternativo devido às limitações de cota da API. As respostas serão mais básicas até que o serviço esteja totalmente disponível.",
    "chat.dismiss": "Fechar",
    "chat.startconversation": "Inicie uma conversa com o assistente de IA.",
    "chat.askanything": "Faça qualquer pergunta ou apenas converse sobre seu dia!",
    
    // Models
    "model.select": "Selecione um modelo",
    "model.llama4maverick": "Llama 4 Maverick",
    "model.llama4maverick.desc": "Último modelo open-source da Meta",
    "model.deephermes3mistral": "DeepHermes 3 Mistral",
    "model.deephermes3mistral.desc": "Modelo avançado da Nous Research",
    "model.qwen330b": "Qwen 3 30B",
    "model.qwen330b.desc": "Poderoso modelo de linguagem da Alibaba",
    
    // Language
    "language.select": "Selecione o idioma",
    "language.en": "Inglês",
    "language.fr": "Francês",
    "language.es": "Espanhol",
    "language.de": "Alemão",
    "language.it": "Italiano",
    "language.pt": "Português",
    "language.ru": "Russo",
    "language.zh": "Chinês",
    "language.ja": "Japonês",
    "language.ar": "Árabe",
  },
  ru: {
    // Navigation
    "nav.home": "Главная",
    "nav.chat": "Чат",
    "nav.settings": "Настройки",
    "nav.signin": "Войти",
    "nav.signout": "Выйти",
    "nav.profile": "Профиль",
    
    // Auth
    "auth.signin": "Войти",
    "auth.signup": "Регистрация",
    "auth.email": "Email",
    "auth.password": "Пароль",
    "auth.forgot": "Забыли пароль?",
    "auth.noaccount": "Нет аккаунта?",
    "auth.haveaccount": "Уже есть аккаунт?",
    
    // Chat
    "chat.placeholder": "Введите сообщение...",
    "chat.send": "Отправить",
    "chat.clear": "Очистить чат",
    "chat.new": "Новый чат",
    "chat.listening": "Слушаю...",
    "chat.speak": "Говорите сейчас",
    "chat.helpful": "Полезно",
    "chat.nothelpful": "Не полезно",
    "chat.copied": "Скопировано!",
    "chat.copieddesc": "Код скопирован в буфер обмена",
    "chat.clearconfirm": "Очистить разговор?",
    "chat.clearconfirmdesc": "Это удалит все сообщения в этом разговоре. Это действие нельзя отменить.",
    "chat.cancel": "Отмена",
    "chat.clearaction": "Очистить",
    "chat.fallback": "Резервный режим",
    "chat.fallbackwarning": "Сервис ИИ в настоящее время работает в резервном режиме из-за ограничений квоты API. Ответы будут более базовыми, пока сервис не станет полностью доступным.",
    "chat.dismiss": "Закрыть",
    "chat.startconversation": "Начните разговор с ИИ-ассистентом.",
    "chat.askanything": "Задайте любой вопрос или просто поговорите о своем дне!",
    
    // Models
    "model.select": "Выберите модель",
    "model.llama4maverick": "Llama 4 Maverick",
    "model.llama4maverick.desc": "Последняя модель Meta с открытым исходным кодом",
    "model.deephermes3mistral": "DeepHermes 3 Mistral",
    "model.deephermes3mistral.desc": "Продвинутая модель от Nous Research",
    "model.qwen330b": "Qwen 3 30B",
    "model.qwen330b.desc": "Мощная языковая модель от Alibaba",
    
    // Language
    "language.select": "Выберите язык",
    "language.en": "Английский",
    "language.fr": "Французский",
    "language.es": "Испанский",
    "language.de": "Немецкий",
    "language.it": "Итальянский",
    "language.pt": "Португальский",
    "language.ru": "Русский",
    "language.zh": "Китайский",
    "language.ja": "Японский",
    "language.ar": "Арабский",
  },
  zh: {
    // Navigation
    "nav.home": "首页",
    "nav.chat": "聊天",
    "nav.settings": "设置",
    "nav.signin": "登录",
    "nav.signout": "退出",
    "nav.profile": "个人资料",
    
    // Auth
    "auth.signin": "登录",
    "auth.signup": "注册",
    "auth.email": "邮箱",
    "auth.password": "密码",
    "auth.forgot": "忘记密码？",
    "auth.noaccount": "没有账号？",
    "auth.haveaccount": "已有账号？",
    
    // Chat
    "chat.placeholder": "输入消息...",
    "chat.send": "发送",
    "chat.clear": "清空聊天",
    "chat.new": "新聊天",
    "chat.listening": "正在听...",
    "chat.speak": "现在说话",
    "chat.helpful": "有帮助",
    "chat.nothelpful": "没帮助",
    "chat.copied": "已复制！",
    "chat.copieddesc": "代码已复制到剪贴板",
    "chat.clearconfirm": "清空对话？",
    "chat.clearconfirmdesc": "这将删除此对话中的所有消息。此操作无法撤销。",
    "chat.cancel": "取消",
    "chat.clearaction": "清空",
    "chat.fallback": "备用模式",
    "chat.fallbackwarning": "由于API配额限制，AI服务目前正在备用模式下运行。在服务完全可用之前，响应将更加基础。",
    "chat.dismiss": "关闭",
    "chat.startconversation": "开始与AI助手对话。",
    "chat.askanything": "提出任何问题或只是聊聊你的一天！",
    
    // Models
    "model.select": "选择模型",
    "model.llama4maverick": "Llama 4 Maverick",
    "model.llama4maverick.desc": "Meta最新的开源模型",
    "model.deephermes3mistral": "DeepHermes 3 Mistral",
    "model.deephermes3mistral.desc": "Nous Research的高级模型",
    "model.qwen330b": "Qwen 3 30B",
    "model.qwen330b.desc": "阿里巴巴的强大语言模型",
    
    // Language
    "language.select": "选择语言",
    "language.en": "英语",
    "language.fr": "法语",
    "language.es": "西班牙语",
    "language.de": "德语",
    "language.it": "意大利语",
    "language.pt": "葡萄牙语",
    "language.ru": "俄语",
    "language.zh": "中文",
    "language.ja": "日语",
    "language.ar": "阿拉伯语",
  },
  ja: {
    // Navigation
    "nav.home": "ホーム",
    "nav.chat": "チャット",
    "nav.settings": "設定",
    "nav.signin": "ログイン",
    "nav.signout": "ログアウト",
    "nav.profile": "プロフィール",
    
    // Auth
    "auth.signin": "ログイン",
    "auth.signup": "登録",
    "auth.email": "メール",
    "auth.password": "パスワード",
    "auth.forgot": "パスワードをお忘れですか？",
    "auth.noaccount": "アカウントをお持ちでないですか？",
    "auth.haveaccount": "すでにアカウントをお持ちですか？",
    
    // Chat
    "chat.placeholder": "メッセージを入力...",
    "chat.send": "送信",
    "chat.clear": "チャットをクリア",
    "chat.new": "新規チャット",
    "chat.listening": "聞いています...",
    "chat.speak": "今話してください",
    "chat.helpful": "役立つ",
    "chat.nothelpful": "役立たない",
    "chat.copied": "コピーしました！",
    "chat.copieddesc": "コードをクリップボードにコピーしました",
    "chat.clearconfirm": "会話をクリアしますか？",
    "chat.clearconfirmdesc": "これにより、この会話のすべてのメッセージが削除されます。この操作は元に戻せません。",
    "chat.cancel": "キャンセル",
    "chat.clearaction": "クリア",
    "chat.fallback": "フォールバック",
    "chat.fallbackwarning": "APIクォータの制限により、AIサービスは現在フォールバックモードで動作しています。サービスが完全に利用可能になるまで、応答はより基本的なものになります。",
    "chat.dismiss": "閉じる",
    "chat.startconversation": "AIアシスタントとの会話を始めましょう。",
    "chat.askanything": "質問をしたり、一日の出来事について話したりしましょう！",
    
    // Models
    "model.select": "モデルを選択",
    "model.llama4maverick": "Llama 4 Maverick",
    "model.llama4maverick.desc": "Metaの最新オープンソースモデル",
    "model.deephermes3mistral": "DeepHermes 3 Mistral",
    "model.deephermes3mistral.desc": "Nous Researchの高度なモデル",
    "model.qwen330b": "Qwen 3 30B",
    "model.qwen330b.desc": "アリババの強力な言語モデル",
    
    // Language
    "language.select": "言語を選択",
    "language.en": "英語",
    "language.fr": "フランス語",
    "language.es": "スペイン語",
    "language.de": "ドイツ語",
    "language.it": "イタリア語",
    "language.pt": "ポルトガル語",
    "language.ru": "ロシア語",
    "language.zh": "中国語",
    "language.ja": "日本語",
    "language.ar": "アラビア語",
  },
  ar: {
    // Navigation
    "nav.home": "الرئيسية",
    "nav.chat": "المحادثة",
    "nav.settings": "الإعدادات",
    "nav.signin": "تسجيل الدخول",
    "nav.signout": "تسجيل الخروج",
    "nav.profile": "الملف الشخصي",
    
    // Auth
    "auth.signin": "تسجيل الدخول",
    "auth.signup": "إنشاء حساب",
    "auth.email": "البريد الإلكتروني",
    "auth.password": "كلمة المرور",
    "auth.forgot": "نسيت كلمة المرور؟",
    "auth.noaccount": "ليس لديك حساب؟",
    "auth.haveaccount": "لديك حساب بالفعل؟",
    
    // Chat
    "chat.placeholder": "اكتب رسالتك...",
    "chat.send": "إرسال",
    "chat.clear": "مسح المحادثة",
    "chat.new": "محادثة جديدة",
    "chat.listening": "جاري الاستماع...",
    "chat.speak": "تحدث الآن",
    "chat.helpful": "مفيد",
    "chat.nothelpful": "غير مفيد",
    "chat.copied": "تم النسخ!",
    "chat.copieddesc": "تم نسخ الكود إلى الحافظة",
    "chat.clearconfirm": "مسح المحادثة؟",
    "chat.clearconfirmdesc": "سيؤدي هذا إلى حذف جميع الرسائل في هذه المحادثة. لا يمكن التراجع عن هذا الإجراء.",
    "chat.cancel": "إلغاء",
    "chat.clearaction": "مسح",
    "chat.fallback": "الوضع الاحتياطي",
    "chat.fallbackwarning": "تعمل خدمة الذكاء الاصطناعي حاليًا في الوضع الاحتياطي بسبب قيود حصة API. ستكون الردود أكثر أساسية حتى تصبح الخدمة متاحة بالكامل.",
    "chat.dismiss": "إغلاق",
    "chat.startconversation": "ابدأ محادثة مع مساعد الذكاء الاصطناعي.",
    "chat.askanything": "اطرح أي سؤال أو تحدث فقط عن يومك!",
    
    // Models
    "model.select": "اختر نموذجًا",
    "model.llama4maverick": "Llama 4 Maverick",
    "model.llama4maverick.desc": "أحدث نموذج مفتوح المصدر من Meta",
    "model.deephermes3mistral": "DeepHermes 3 Mistral",
    "model.deephermes3mistral.desc": "نموذج متقدم من Nous Research",
    "model.qwen330b": "Qwen 3 30B",
    "model.qwen330b.desc": "نموذج لغوي قوي من Alibaba",
    
    // Language
    "language.select": "اختر اللغة",
    "language.en": "الإنجليزية",
    "language.fr": "الفرنسية",
    "language.es": "الإسبانية",
    "language.de": "الألمانية",
    "language.it": "الإيطالية",
    "language.pt": "البرتغالية",
    "language.ru": "الروسية",
    "language.zh": "الصينية",
    "language.ja": "اليابانية",
    "language.ar": "العربية",
  },
} as const

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      const savedLang = localStorage.getItem("language") as Language
      if (savedLang && Object.keys(translations).includes(savedLang)) {
        return savedLang
      }
      return "en"
    }
    return "en"
  })

  useEffect(() => {
    localStorage.setItem("language", language)
    // Update document direction for RTL languages
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr"
    // Update document language
    document.documentElement.lang = language
  }, [language])

  const t = (key: string): string => {
    const langTranslations = translations[language as keyof typeof translations]
    return langTranslations[key as keyof typeof langTranslations] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}

export default LanguageProvider 