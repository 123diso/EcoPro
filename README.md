# Dandi-Eco — README

Dandi-Eco es una aplicación web construida con React + TypeScript, integrada con Supabase para autenticación, gestión de usuarios, publicaciones, configuración de usuarios y trueques de productos entre personas.
El proyecto permite a los usuarios publicar productos, registrarlos para trueques, generar códigos QR, navegar a través de tiendas Dandi cercanas en un mapa donde están las tiendas, y realizar intercambios entre usuarios gracias a un administrador que puede supervisar los trueques y estados de los productos.

---

## Tecnologías utilizadas

### Frontend
• React + TypeScript  
• React Router DOM  
• React Context API  
• Hooks personalizados  
• Leaflet + React-Leaflet  
• react-qr-code  
• CSS Modules y estilos locales  
• JSON assets para categorías, puntos Dandi, productos sugeridos, etc.

### Backend (BaaS)
• Supabase  
• Autenticación  
• Base de datos PostgreSQL  
• Row Level Security (RLS)  
• Realtime Subscriptions  

---

## Estructura del proyecto

'''
eco-pro/
+-- public/
+-- src/
¦   +-- assets/          # JSONs, imágenes, íconos, logos
¦   +-- components/      # Componentes reutilizables de UI
¦   +-- context/         # Contextos globales (Auth, Products, Settings...)
¦   +-- hooks/           # Hooks personalizados
¦   +-- pages/           # Páginas completas (Home, Mapa, Perfil, Admin...)
¦   +-- services/        # Llamadas a Supabase y lógica de negocio
¦   +-- types/           # Tipos TypeScript compartidos
¦   +-- utils/           # Utilidades generales
¦
+-- App.tsx              # Definición de rutas y layout principal
+-- App.css
+-- main.tsx             # Punto de entrada de React
+-- supabaseClient.ts    # Cliente de Supabase, variables
+-- vite.config.ts
+-- tsconfig*.json
+-- .env                 # Variables de entorno
'''

---

## Flujo general de la aplicación

### Autenticación
• Login y registro con AuthForm y useAuthActions.  
• Se guarda metadata del usuario (full_name, username).  
• Se crea automáticamente un perfil en la tabla profiles.

### Publicar producto
• Desde el perfil (ProfilePage) se abre ProductPublishModal.  
• El producto se guarda en user_posts.  
• AllProductsContext escucha cambios en tiempo real desde Supabase.

### Iniciar un trueque
Desde ProductDetail, el usuario puede:  
• Ver la tienda asociada al producto.  
• Abrir ProductRegisterModal.  
• Generar un QR con los datos necesarios.  

Flujo:  
1. Usuario abre/escanea un QR ? TradeStart.  
2. Selecciona qué producto quiere ofrecer.  
3. TradeConfirm registra el trueque en la tabla trades.

### Confirmar y administrar trueques
• TradeConfirm inserta un nuevo registro en trades.  
• El panel admin (AdminDashboard) permite ver trueques y cambiar estados.  
• También gestiona reportes y publicaciones.

### Mapa
• MapPage carga tiendas desde dandiPoints.json.  
• Se muestra la ubicación del usuario.  
• Se resaltan las tiendas donde el usuario tiene publicaciones.  
• Al seleccionar una tienda ? PuntoDetalle.

### Perfil y guardados
• ProfilePage muestra:  
  - Publicaciones propias 
- Opción para cerrar sesión o ir al modo administrador.

### Ajustes
SettingsPage permite:  
• Activar/desactivar notificaciones  
• Cambiar idioma  
• Actualizar ubicación  
• Cerrar sesión  

---

# Tablas de Supabase (Resumen)

Un resumen de las tablas utilizadas por la aplicación.

---

## profiles
Información básica del usuario.

• id (uuid) – Identificador del usuario  
• email (text) – Correo  
• full_name (text) – Nombre completo  
• username (text) – Alias  
• avatar_url (text) – Imagen  
• created_at / updated_at – Fechas del registro  

---

## user_posts
Publicaciones de productos.

• id (uuid) – Producto  
• user_id (uuid) – Autor  
• title (text) – Título  
• category (text) – Categoría  
• description (text) – Descripción  
• condition (text) – Estado del producto  
• location (text) – Tienda Dandi asignada  
• image (text) – Imagen del producto  
• qr_code_url (text) – QR opcional  
• created_at / updated_at – Fechas del registro  

---

## user_settings
Preferencias del usuario.

• notifications (boolean) – Activar o no  
• dark_mode (boolean) – Modo oscuro  
• location (text) – Ubicación  
• language (text) – Idioma  
• user_id (uuid) – Usuario dueño  

---

## notifications
Notificaciones enviadas al usuario.

• type – Tipo de notificación  
• title – Título  
• message – Contenido  
• related_product_id – Producto relacionado  
• related_trade_id – Trueque asociado  
• from_user_id – Usuario que originó la notificación  
• is_read – Estado de lectura  
• created_at – Fecha  

---

## reports
Reportes de productos.

• product_id – Producto reportado  
• user_id – Usuario que reporta  
• title – Motivo  
• description – Detalle  
• status – Estado del reporte  
• created_at – Fecha  

---

## saved_posts
Productos guardados por usuarios.

• user_id – Usuario  
• post_id – Producto guardado  
• saved_at – Fecha de guardado  

---

## trades
Trueques registrados.

• product_offer_id – Producto ofrecido  
• product_receive_id – Producto que se quiere obtener  
• offering_user_id – Usuario que ofrece  
• receiving_user_id – Usuario que recibe  
• status – Estado del trueque  
• created_at / updated_at – Fechas  

---
