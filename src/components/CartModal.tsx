"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { X, ShoppingCart, Trash2, AlertCircle } from "lucide-react"
import { useCart } from "../context/CartContext"
import { Button } from "../components/ui/button"
import { useAuth } from "../context/AuthContext"
import { useToast } from "../components/ui/use-toast"
import { useRouter } from "next/navigation"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog"

interface CartModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function CartModal({ isOpen, onClose }: CartModalProps) {
  const { cart, removeFromCart, clearCart, updateQuantity } = useCart()
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [showLoginAlert, setShowLoginAlert] = useState(false)

  if (!isOpen) return null

  const handleCheckout = () => {
    if (!user) {
      // Show login alert dialog instead of just a toast
      setShowLoginAlert(true)
      return
    }

    setIsCheckingOut(true)

    // Simulate checkout process
    setTimeout(() => {
      clearCart()
      setIsCheckingOut(false)
      toast({
        title: "Checkout Complete",
        description: "Thank you for your purchase!",
      })
      onClose()
    }, 1500)
  }

  const handleLoginRedirect = () => {
    onClose() // Close the cart modal
    router.push("/login") // Redirect to login page
  }

  const totalPrice = cart.reduce((total, item) => {
    return total + (item.price || 19.99) * item.quantity
  }, 0)

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity >= 1) {
      updateQuantity(id, newQuantity)
    }
  }

  return (
    <>
      <div className="fixed inset-0 z-50" onClick={onClose}>
        <div
          className="absolute top-16 right-2 sm:right-4 md:right-8 w-[calc(100%-1rem)] sm:w-[380px] max-h-[80vh] bg-background rounded-lg shadow-xl border overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sticky top-0 bg-background z-10 flex justify-between items-center p-3 border-b">
            <h2 className="text-base font-bold flex items-center">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Your Cart ({cart.length} {cart.length === 1 ? "item" : "items"})
            </h2>
            <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </div>

          {cart.length === 0 ? (
            <div className="text-center py-10 px-4">
              <div className="flex justify-center mb-3">
                <ShoppingCart className="h-12 w-12 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground mb-3 text-sm">Your cart is empty</p>
              <Button size="sm" onClick={onClose}>
                Continue Shopping
              </Button>
            </div>
          ) : (
            <>
              <div className="overflow-y-auto flex-grow">
                <div className="p-3 space-y-3">
                  {cart.map((item) => (
                    <div key={item.id} className="flex border-b pb-3">
                      <div className="w-16 h-24 relative flex-shrink-0 bg-muted rounded-md overflow-hidden">
                        <Image
                          src={item.image_url || "/placeholder.svg"}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="ml-3 flex-grow min-w-0">
                        <Link href={`/book/${item.id}`} onClick={onClose}>
                          <h3 className="font-medium text-sm hover:text-primary truncate">{item.title}</h3>
                        </Link>
                        <p className="text-xs text-muted-foreground truncate">{item.authors}</p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-6 w-6 text-xs"
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              type="button"
                            >
                              -
                            </Button>
                            <span className="mx-2 min-w-[20px] text-center text-sm">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-6 w-6 text-xs"
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              type="button"
                            >
                              +
                            </Button>
                          </div>
                          <span className="font-medium text-sm">
                            €{((item.price || 19.99) * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="ml-1 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 h-6 w-6 self-start"
                        onClick={() => removeFromCart(item.id)}
                        type="button"
                      >
                        <Trash2 className="h-3 w-3" />
                        <span className="sr-only">Remove</span>
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t p-3 bg-background">
                {!user && (
                  <div className="mb-3 p-2 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-md text-xs text-amber-800 dark:text-amber-300 flex items-start">
                    <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0 mt-0.5" />
                    <p>You need to be logged in to complete your purchase.</p>
                  </div>
                )}

                <div className="flex justify-between mb-1 text-sm">
                  <span>Subtotal</span>
                  <span>€{totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2 text-sm">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between text-base font-bold mb-3">
                  <span>Total</span>
                  <span>€{totalPrice.toFixed(2)}</span>
                </div>

                <div className="flex flex-col gap-2">
                  <Button className="w-full" size="sm" onClick={handleCheckout} disabled={isCheckingOut} type="button">
                    {isCheckingOut ? "Processing..." : "Checkout"}
                  </Button>

                  <Button variant="outline" size="sm" className="w-full" onClick={clearCart} type="button">
                    Clear Cart
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Login Alert Dialog */}
      <AlertDialog open={showLoginAlert} onOpenChange={setShowLoginAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Login Required</AlertDialogTitle>
            <AlertDialogDescription>
              You need to be logged in to complete your purchase. Would you like to log in now?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowLoginAlert(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleLoginRedirect}>Log In</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

