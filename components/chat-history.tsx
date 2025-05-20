import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Trash2, MessageSquare } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

type Conversation = {
  id: string
  created_at: string
  updated_at: string
  preview: string
}

export default function ChatHistory({
  onSelectConversation,
  currentConversationId,
  onNewChat,
}: {
  onSelectConversation: (conversationId: string) => void
  currentConversationId: string | null
  onNewChat: () => void
}) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [conversationToDelete, setConversationToDelete] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      loadConversations()
    }
  }, [user])

  const loadConversations = async () => {
    try {
      const response = await fetch("/api/conversations")
      if (response.ok) {
        const data = await response.json()
        setConversations(data.conversations)
      }
    } catch (error) {
      console.error("Error loading conversations:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteConversation = async () => {
    if (!conversationToDelete) return

    try {
      const response = await fetch(`/api/conversation/${conversationToDelete}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setConversations((prev) => prev.filter((conv) => conv.id !== conversationToDelete))
        if (currentConversationId === conversationToDelete) {
          onNewChat()
        }
      }
    } catch (error) {
      console.error("Error deleting conversation:", error)
    } finally {
      setShowDeleteDialog(false)
      setConversationToDelete(null)
    }
  }

  if (!user) {
    return (
      <div className="p-4 text-center text-gray-500">
        Please log in to view your chat history
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <Button
          onClick={onNewChat}
          className="w-full"
          variant="outline"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Chat
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {isLoading ? (
          <div className="text-center text-gray-500">Loading conversations...</div>
        ) : conversations.length === 0 ? (
          <div className="text-center text-gray-500">No conversations yet</div>
        ) : (
          <div className="space-y-2">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`flex items-center justify-between p-2 rounded-lg cursor-pointer hover:bg-gray-100 ${
                  currentConversationId === conversation.id ? "bg-gray-100" : ""
                }`}
              >
                <div
                  className="flex-1 flex items-center"
                  onClick={() => onSelectConversation(conversation.id)}
                >
                  <MessageSquare className="h-4 w-4 mr-2 text-gray-500" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{conversation.preview}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(conversation.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => {
                    setConversationToDelete(conversation.id)
                    setShowDeleteDialog(true)
                  }}
                >
                  <Trash2 className="h-4 w-4 text-gray-500" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete conversation?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this conversation and all its messages. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConversation}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
} 