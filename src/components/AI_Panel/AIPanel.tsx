import { useState } from 'react';
import { X, Send, Sparkles, Loader2, Copy, Check } from 'lucide-react';
import { useUIStore } from '../../stores/uiStore';
import { useNoteStore } from '../../stores/noteStore';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { cn } from '../../lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

const quickActions = [
  { label: '续写内容', prompt: '请根据上文内容继续写作' },
  { label: '总结摘要', prompt: '请为这篇笔记生成一个简洁的摘要' },
  { label: '润色优化', prompt: '请优化这段文字的表达，使其更加流畅' },
  { label: '检查语法', prompt: '请检查上文内容的语法错误并给出修改建议' },
];

export function AIPanel() {
  const { aiPanelOpen, toggleAiPanel } = useUIStore();
  const { getSelectedNote } = useNoteStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const selectedNote = getSelectedNote();

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response (in real app, this would call an API)
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '这是一个演示版本的 AI 助手。在正式版本中，这里将连接到 Claude 或 OpenAI API 来提供智能写作辅助功能。',
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleQuickAction = (action: typeof quickActions[0]) => {
    setInput(action.prompt);
  };

  const copyToClipboard = (text: string, messageId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(messageId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!aiPanelOpen) return null;

  return (
    <div className="w-[360px] h-full flex flex-col bg-[var(--bg-secondary)] border-l border-[var(--border)]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
        <div className="flex items-center gap-2">
          <Sparkles size={18} className="text-[var(--accent-primary)]" />
          <h2 className="font-semibold text-[var(--text-primary)]">AI 助手</h2>
        </div>
        <Button variant="ghost" size="sm" onClick={toggleAiPanel} className="w-8 h-8 p-0">
          <X size={18} />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-8">
            <Sparkles size={40} className="mx-auto mb-3 text-[var(--text-muted)]" />
            <p className="text-sm text-[var(--text-secondary)] mb-4">
              {selectedNote
                ? `正在查看笔记: ${selectedNote.title}`
                : '请先选择一篇笔记'}
            </p>
            <div className="space-y-2">
              <p className="text-xs text-[var(--text-muted)] mb-2">快捷指令</p>
              {quickActions.map(action => (
                <Button
                  key={action.label}
                  variant="secondary"
                  size="sm"
                  onClick={() => handleQuickAction(action)}
                  className="w-full justify-start text-xs"
                  disabled={!selectedNote}
                >
                  {action.label}
                </Button>
              ))}
            </div>
          </div>
        )}

        {messages.map(message => (
          <div
            key={message.id}
            className={cn(
              'flex flex-col',
              message.role === 'user' ? 'items-end' : 'items-start'
            )}
          >
            <div
              className={cn(
                'max-w-[85%] rounded-lg px-3 py-2 text-sm',
                message.role === 'user'
                  ? 'bg-[var(--accent-primary)] text-white'
                  : 'bg-[var(--bg-tertiary)] text-[var(--text-primary)]'
              )}
            >
              {message.content}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-[var(--text-muted)]">
                {new Date(message.timestamp).toLocaleTimeString('zh-CN', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
              {message.role === 'assistant' && (
                <button
                  onClick={() => copyToClipboard(message.content, message.id)}
                  className="text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                >
                  {copiedId === message.id ? (
                    <Check size={12} className="text-green-500" />
                  ) : (
                    <Copy size={12} />
                  )}
                </button>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-[var(--text-muted)]">
            <Loader2 size={16} className="animate-spin" />
            <span className="text-sm">AI 正在思考...</span>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-[var(--border)]">
        <div className="flex items-center gap-2">
          <Input
            type="text"
            placeholder="输入消息..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            className="flex-1"
            disabled={!selectedNote || isLoading}
          />
          <Button
            variant="primary"
            size="sm"
            onClick={handleSend}
            disabled={!input.trim() || !selectedNote || isLoading}
          >
            <Send size={16} />
          </Button>
        </div>
        <p className="text-xs text-[var(--text-muted)] mt-2 text-center">
          AI 功能需要配置 API 密钥后方可使用
        </p>
      </div>
    </div>
  );
}
