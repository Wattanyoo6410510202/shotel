# Vue 3 + TypeScript + Vite

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about the recommended Project Setup and IDE Support in the [Vue Docs TypeScript Guide](https://vuejs.org/guide/typescript/overview.html#project-setup).
เรียบร้อยครับ! ผมได้ติดตั้งระบบโปรโมชั่นพร้อมฐานข้อมูล SQLite และระบบ Admin ให้คุณแล้ว โดยมีรายละเอียดดังนี้ครับ:

  วิธีใช้งานระบบ Admin
   1. การเข้าสู่ระบบ: ให้คุณพิมพ์ ?admin=true ต่อท้าย URL ของเว็บ (เช่น localhost:5173/?admin=true) หน้าจอ Login ของ Admin จะเด้งขึ้นมา
   2. รหัสผ่าน: ใช้รหัส 1234 ตามที่กำหนด
   3. การอัปเดต: เมื่อ Login แล้ว คุณสามารถเลือกไฟล์รูปภาพและพิมพ์คำอธิบายโปรโมชั่นใหม่ได้เลย เมื่อกด Save ระบบจะบันทึกลง SQLite และรีเฟรชหน้าเว็บให้เห็นผลทันที

  ส่วนประกอบของระบบ
   * Backend (Express + SQLite): อยู่ในโฟลเดอร์ server/ จัดการเรื่องการเก็บข้อมูลและไฟล์รูปภาพที่อัปโหลด (เก็บไว้ใน server/uploads/)
   * Promotion Modal: เมื่อคนทั่วไปเข้าเว็บ จะมี Popup แสดงภาพและข้อความโปรโมชั่นล่าสุดเด้งขึ้นมาทันที (จะเด้งแค่ครั้งเดียวต่อการเปิด Browser เพื่อไม่ให้รบกวนผู้ใช้)
   * Database: ใช้ SQLite ไฟล์ server/database.sqlite ดูแลง่ายและไม่ต้องติดตั้ง Database Server เพิ่มเติม

  วิธีรันระบบ (สำคัญ)
  เนื่องจากตอนนี้มีทั้งส่วนหน้าเว็บ (Frontend) และหลังบ้าน (Backend) คุณต้องรัน 2 คำสั่งพร้อมกัน:
   1. รันหน้าเว็บ: npm run dev
   2. รันหลังบ้าน: npm run server (ผมได้เพิ่ม script นี้ลงใน package.json ให้แล้วครับ)

  ลองใช้งานดูได้เลยครับ ถ้าอยากให้ปรับดีไซน์ Popup หรือเพิ่มส่วนไหนบอกได้เลยนะครับ!
