<script setup lang="ts">
import { ref, onMounted } from 'vue'
import VueApexCharts from 'vue3-apexcharts'
import type { ApexOptions } from 'apexcharts'
import { supabase } from '../lib/supabase'

const startDate = ref<string>('')
const endDate = ref<string>('')

/* =======================
   Cookie Consent Chart
======================= */

const consentChartOptions = ref<ApexOptions>({
  labels: ['Accept', 'Deny', 'Custom Settings'],
  colors: ['#00E396', '#FF4560', '#FEB019'],
  chart: {
    type: 'donut',
    toolbar: { show: true }
  },
  plotOptions: {
    pie: {
      donut: {
        size: '65%'
      }
    }
  }
})

const consentSeries = ref<number[]>([0, 0, 0])

/* =======================
   Promotion Chart
======================= */

const promoChartOptions = ref<ApexOptions>({
  chart: {
    type: 'bar',
    toolbar: { show: true }
  },
  xaxis: {
    categories: []
  },
  colors: ['#008FFB']
})

const promoSeries = ref([
  { name: 'Clicks', data: [] as number[] },
  { name: 'Dismisses', data: [] as number[] }
])

/* =======================
   Fetch Data
======================= */

const fetchData = async () => {
  let query = supabase
    .from('analytics_events')
    .select('event_name, event_value, created_at')

  if (startDate.value) {
    query = query.gte(
      'created_at',
      new Date(startDate.value).toISOString()
    )
  }

  if (endDate.value) {
    const end = new Date(endDate.value)
    end.setHours(23, 59, 59, 999)
    query = query.lte('created_at', end.toISOString())
  }

  const { data: events } = await query

  if (!events) return

  /* ---- Consent Data ---- */

  const consentData = events.filter(
    e => e.event_name === 'cookie_consent'
  )

  consentSeries.value = [
    consentData.filter(e => e.event_value === 'accept').length,
    consentData.filter(e => e.event_value === 'deny').length,
    consentData.filter(e => e.event_value === 'custom_settings').length
  ]

  /* ---- Promotion Data ---- */

  const promoEvents = events.filter(
    e =>
      e.event_name === 'promotion_click' ||
      e.event_name === 'promotion_dismiss'
  )

  const { data: promotions } = await supabase
    .from('promotion')
    .select('id, description')

  if (!promotions) return

  const promoData = promotions.map(p => {
    const clicks = promoEvents.filter(
      e =>
        e.event_name === 'promotion_click' &&
        e.event_value === p.id.toString()
    ).length

    const dismisses = promoEvents.filter(
      e =>
        e.event_name === 'promotion_dismiss' &&
        e.event_value === p.id.toString()
    ).length

    return {
      desc: (p.description || 'Promo').substring(0, 15) + '...',
      clicks,
      dismisses
    }
  })

  promoChartOptions.value = {
    ...promoChartOptions.value,
    xaxis: {
      categories: promoData.map(c => c.desc)
    }
  }

  promoSeries.value = [
    { name: 'Clicks', data: promoData.map(c => c.clicks) },
    { name: 'Dismisses', data: promoData.map(c => c.dismisses) }
  ]
}

onMounted(fetchData)
</script>

<template>
  <div class="analytics-dashboard">
    <div class="filters">
      <input type="date" v-model="startDate" />
      <input type="date" v-model="endDate" />
      <button @click="fetchData" class="btn-luxury">
        Filter
      </button>
    </div>

    <div class="charts-container">
      <div class="analytics-card">
        <h3>Cookie Consent</h3>
        <VueApexCharts
          type="donut"
          :options="consentChartOptions"
          :series="consentSeries"
        />
      </div>

      <div class="analytics-card">
        <h3>Promotion Clicks</h3>
        <VueApexCharts
          type="bar"
          :options="promoChartOptions"
          :series="promoSeries"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.analytics-dashboard {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.filters {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.charts-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.analytics-card {
  background: #fff;
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}

.btn-luxury {
  background: #000;
  color: #fff;
  border: none;
  padding: 8px 16px;
  cursor: pointer;
  border-radius: 4px;
}

@media (max-width: 900px) {
  .charts-container {
    grid-template-columns: 1fr;
  }
}
</style>