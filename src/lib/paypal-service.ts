// PayPal Service for Subscription Management
// Note: This uses the custom endpoint for demo purposes
// In production, replace with actual PayPal SDK integration

interface PayPalPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  billingCycle: 'monthly' | 'yearly';
}

interface SubscriptionResult {
  success: boolean;
  subscriptionId?: string;
  approvalUrl?: string;
  error?: string;
}

interface WebhookEvent {
  id: string;
  event_type: string;
  resource: any;
  create_time: string;
}

export class PayPalService {
  private clientId: string;
  private clientSecret: string;
  private environment: 'sandbox' | 'production';

  constructor() {
    this.clientId = process.env.PAYPAL_CLIENT_ID || '';
    this.clientSecret = process.env.PAYPAL_CLIENT_SECRET || '';
    this.environment = (process.env.PAYPAL_ENVIRONMENT || 'sandbox') as 'sandbox' | 'production';
  }

  // Get available subscription plans
  getPlans(): PayPalPlan[] {
    return [
      {
        id: 'P-STARTER-MONTHLY-001',
        name: 'Starter Monthly',
        description: 'Starter plan with 25 videos per month',
        price: 25,
        billingCycle: 'monthly'
      },
      {
        id: 'P-PRO-MONTHLY-001',
        name: 'Pro Monthly',
        description: 'Pro plan with 100 videos per month',
        price: 45,
        billingCycle: 'monthly'
      },
      {
        id: 'P-ENTERPRISE-MONTHLY-001',
        name: 'Enterprise Monthly',
        description: 'Enterprise plan with unlimited videos',
        price: 125,
        billingCycle: 'monthly'
      }
    ];
  }

  // Create subscription
  async createSubscription(planId: string, userId: string, userEmail: string): Promise<SubscriptionResult> {
    try {
      // Simulate PayPal subscription creation
      // In production, this would use PayPal SDK
      
      const subscriptionId = `I-${Math.random().toString(36).substring(2).toUpperCase()}`;
      const approvalUrl = `https://www.${this.environment === 'sandbox' ? 'sandbox.' : ''}paypal.com/webapps/billing/subscriptions/subscribe?subscription_id=${subscriptionId}`;

      return {
        success: true,
        subscriptionId,
        approvalUrl,
      };

    } catch (error) {
      console.error('PayPal subscription creation failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Subscription creation failed',
      };
    }
  }

  // Cancel subscription
  async cancelSubscription(subscriptionId: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Simulate PayPal subscription cancellation
      // In production, this would use PayPal SDK
      
      return {
        success: true,
      };

    } catch (error) {
      console.error('PayPal subscription cancellation failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Cancellation failed',
      };
    }
  }

  // Process plan change
  async changePlan(subscriptionId: string, newPlanId: string): Promise<{ success: boolean; error?: string }> {
    try {
      // First cancel existing subscription
      await this.cancelSubscription(subscriptionId);
      
      // Create new subscription with new plan
      // In production, this would handle prorated billing
      
      return {
        success: true,
      };

    } catch (error) {
      console.error('PayPal plan change failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Plan change failed',
      };
    }
  }

  // Verify webhook signature and process event
  async processWebhook(headers: Record<string, string>, body: string): Promise<{ success: boolean; processed?: boolean; error?: string }> {
    try {
      // Verify webhook signature
      const isValid = await this.verifyWebhookSignature(headers, body);
      
      if (!isValid) {
        return {
          success: false,
          error: 'Invalid webhook signature',
        };
      }

      const event: WebhookEvent = JSON.parse(body);
      
      // Process different event types
      switch (event.event_type) {
        case 'BILLING.SUBSCRIPTION.ACTIVATED':
          await this.handleSubscriptionActivated(event.resource);
          break;
          
        case 'BILLING.SUBSCRIPTION.CANCELLED':
          await this.handleSubscriptionCancelled(event.resource);
          break;
          
        case 'PAYMENT.SALE.COMPLETED':
          await this.handlePaymentCompleted(event.resource);
          break;
          
        case 'BILLING.SUBSCRIPTION.SUSPENDED':
          await this.handleSubscriptionSuspended(event.resource);
          break;
          
        default:
          console.log(`Unhandled webhook event: ${event.event_type}`);
          return {
            success: true,
            processed: false,
          };
      }

      return {
        success: true,
        processed: true,
      };

    } catch (error) {
      console.error('Webhook processing failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Webhook processing failed',
      };
    }
  }

  // Verify webhook signature (simplified)
  private async verifyWebhookSignature(headers: Record<string, string>, body: string): Promise<boolean> {
    // In production, implement proper HMAC verification
    // For demo purposes, return true
    return true;
  }

  // Handle subscription activation
  private async handleSubscriptionActivated(resource: any): Promise<void> {
    const { prisma } = await import('./database');
    
    try {
      // Update user subscription status
      await prisma.subscription.upsert({
        where: {
          paypalSubscriptionId: resource.id,
        },
        update: {
          status: 'active',
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        },
        create: {
          userId: resource.custom_id, // Assuming custom_id contains user ID
          paypalSubscriptionId: resource.id,
          planId: resource.plan_id,
          status: 'active',
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          paypalPlanId: resource.plan_id,
        },
      });

      console.log('Subscription activated:', resource.id);
    } catch (error) {
      console.error('Failed to handle subscription activation:', error);
    }
  }

  // Handle subscription cancellation
  private async handleSubscriptionCancelled(resource: any): Promise<void> {
    const { prisma } = await import('./database');
    
    try {
      await prisma.subscription.update({
        where: {
          paypalSubscriptionId: resource.id,
        },
        data: {
          status: 'cancelled',
          cancelAtPeriodEnd: true,
        },
      });

      console.log('Subscription cancelled:', resource.id);
    } catch (error) {
      console.error('Failed to handle subscription cancellation:', error);
    }
  }

  // Handle payment completion
  private async handlePaymentCompleted(resource: any): Promise<void> {
    const { prisma } = await import('./database');
    
    try {
      // Record payment
      await prisma.payment.create({
        data: {
          subscriptionId: resource.billing_agreement_id,
          paypalPaymentId: resource.id,
          amount: parseFloat(resource.amount.total),
          currency: resource.amount.currency,
          status: 'completed',
          paymentDate: new Date(resource.create_time),
          metadata: {
            transactionId: resource.id,
            payerEmail: resource.payer.payer_info.email,
          },
        },
      });

      console.log('Payment completed:', resource.id);
    } catch (error) {
      console.error('Failed to handle payment completion:', error);
    }
  }

  // Handle subscription suspension
  private async handleSubscriptionSuspended(resource: any): Promise<void> {
    const { prisma } = await import('./database');
    
    try {
      await prisma.subscription.update({
        where: {
          paypalSubscriptionId: resource.id,
        },
        data: {
          status: 'suspended',
        },
      });

      console.log('Subscription suspended:', resource.id);
    } catch (error) {
      console.error('Failed to handle subscription suspension:', error);
    }
  }

  // Get subscription status
  async getSubscriptionStatus(subscriptionId: string): Promise<{
    status: string;
    nextBillingTime?: string;
    error?: string;
  }> {
    try {
      // In production, fetch from PayPal API
      // For demo, return simulated status
      
      return {
        status: 'active',
        nextBillingTime: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      };

    } catch (error) {
      console.error('Failed to get subscription status:', error);
      return {
        status: 'unknown',
        error: error instanceof Error ? error.message : 'Status check failed',
      };
    }
  }
}

export const paypalService = new PayPalService();