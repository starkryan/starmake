"use client"

import { supabase } from "@/lib/supabase"
import { useEffect, useState } from "react"
import { FaWallet, FaPlus } from "react-icons/fa6"

interface UserBalanceDisplayProps {
  userId: string
  className?: string
  showAddButton?: boolean
  onAddMoney?: () => void
}

export default function UserBalanceDisplay({ 
  userId, 
  className = "", 
  showAddButton = false,
  onAddMoney 
}: UserBalanceDisplayProps) {
  const [balance, setBalance] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserBalance = async () => {
      if (!userId) {
        setBalance(0)
        setLoading(false)
        return
      }

      try {
        const { data, error } = await supabase
          .from('user_balance')
          .select('balance')
          .eq('user_id', userId)
          .single()

        if (error) {
          if (error.code === 'PGRST116') {
            // No balance record found, create one with default 0 balance
            const { data: newBalance } = await supabase
              .from('user_balance')
              .insert([{ user_id: userId, balance: 0 }])
              .select('balance')
              .single()
            
            setBalance(newBalance?.balance || 0)
          } else {
            console.error('Error fetching balance:', error)
            setBalance(0)
          }
        } else {
          setBalance(data.balance)
        }
      } catch (error) {
        console.error('Error fetching user balance:', error)
        setBalance(0)
      } finally {
        setLoading(false)
      }
    }

    fetchUserBalance()
  }, [userId])

  return (
    <div className={`flex items-center gap-2 bg-primary/10 px-3 py-2 rounded-full ${className}`}>
      <FaWallet className="text-primary h-4 w-4" />
      
      {loading ? (
        <div className="h-4 w-12 bg-muted rounded animate-pulse"></div>
      ) : (
        <span className="text-sm font-medium text-primary">
          ₹{balance?.toLocaleString() || 0}
        </span>
      )}
      
      {showAddButton && (
        <button
          onClick={onAddMoney}
          className="ml-2 p-1 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors"
          aria-label="Add money"
        >
          <FaPlus className="h-3 w-3" />
        </button>
      )}
    </div>
  )
}
