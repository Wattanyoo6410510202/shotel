import { supabase } from './supabase'

export const trackEvent = async (
  eventName: string,
  eventValue?: string,
  metadata?: Record<string, any>,
  isAnonymous: boolean = false
) => {
  try {
    let userId = null
    if (!isAnonymous) {
      const { data: { user } } = await supabase.auth.getUser()
      userId = user?.id || null
    }
    
    await supabase.from('analytics_events').insert({
      event_name: eventName,
      event_value: eventValue,
      user_id: userId,
      metadata: {
        ...metadata,
        url: window.location.href,
        userAgent: navigator.userAgent
      }
    })
  } catch (error) {
    console.error('Error tracking event:', error)
  }
}
