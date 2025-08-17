## 四、Java 反射机制 (Reflection)

### 1. 反射的核心思想

> [!info] 什么是反射？
> **反射 (Reflection)** 是 Java 语言的一个强大特性，它允许程序在**运行时**动态地**获取任何类的内部信息**，并且能**直接操作任意对象的内部属性和方法**。这种在运行时才去“看”和“操作”类或对象的能力，就是反射的核心。

-   **常规方式**: `类名.属性` 或 `对象.方法()`。在**编译时**，编译器会检查类和方法是否存在。
-   **反射方式**: 通过字符串形式的类名或方法名，在**运行时**加载类、创建对象、调用方法。编译器在编译时对此一无所知。

> [!tip] 反射的基石：`java.lang.Class` 类
> JVM在加载一个类时，会为该类在方法区生成一个对应的、唯一的 `Class` 类型的对象。这个 `Class` 对象就如同这个类的一张“图纸”或“说明书”，包含了类的所有信息（名称、父类、接口、构造器、属性、方法等）。反射机制的入口就是获取这个 `Class` 对象。

---

### 2. 获取 `Class` 对象的四种方式

要想使用反射，第一步必须是获取目标类的 `Class` 对象。

1.  **`类名.class` (最常用)**:
    -   性能最高，因为在编译期就已经确定。适用于已知具体类的情况。
    -   `Class<User> userClass = User.class;`

2.  **`对象.getClass()`**:
    -   通过一个已经存在的对象来获取其 `Class` 对象。
    -   `User user = new User(); Class<?> userClass = user.getClass();`

3.  **`Class.forName("全限定类名")`**:
    -   最灵活的方式，通常用于读取配置文件、解耦等场景，因为类名是在运行时通过字符串指定的。
    -   `Class<?> userClass = Class.forName("com.example.User");`
    -   `ClassNotFoundException` 是一个常见的受检异常。

4.  **`类加载器.loadClass("全限定类名")`**:
    -   通过类加载器来获取，与 `forName` 类似，但 `forName` 默认会执行类的静态初始化，而 `loadClass` 不会。

---

### 3. 反射的核心 API

一旦获取了 `Class` 对象，就可以通过它提供的丰富API来探索和操作类的内部结构。

> [!check] API 命名规律：`getXxx` vs. `getDeclaredXxx`
> -   **`get...()` 系列**: 只能获取**公开的 (public)** 成员，但**包括从父类继承**的成员。
> -   **`getDeclared...()` 系列**: 可以获取**所有权限 (public, protected, default, private) 的**成员，但**仅限于当前类自己声明**的，不包括父类的。

#### 3.1 获取类的基本信息

```java
Class<?> clazz = Child.class;

// 获取类的名称
System.out.println(clazz.getName());           // com.example.Child (全限定名)
System.out.println(clazz.getSimpleName());   // Child (简单名)
System.out.println(clazz.getPackageName());  // com.example (包名)

// 获取父类
Class<?> superclass = clazz.getSuperclass(); // 返回 User.class
System.out.println(superclass.getSimpleName());

// 获取实现的接口
Class<?>[] interfaces = clazz.getInterfaces(); // 返回该类直接实现的所有接口

// 获取修饰符 (权限、final、abstract等)
int modifiers = clazz.getModifiers();
System.out.println(Modifier.isPublic(modifiers));  // true
System.out.println(Modifier.isFinal(modifiers));   // false
```

#### 3.2 操作构造方法 (Constructor)

-   **目的**: 通过反射创建类的实例。
-   **核心 API**:
    -   `getDeclaredConstructor(Class<?>... parameterTypes)`: 获取指定参数列表的构造器。
    -   `Constructor.setAccessible(true)`: 暴力破解，用于访问私有构造器。
    -   `Constructor.newInstance(Object... initargs)`: 调用构造器创建对象。

```java
Class<Emp> empClass = Emp.class;

// 1. 获取无参构造器
Constructor<Emp> constructor = empClass.getDeclaredConstructor();

// 2. (如果构造器是私有的) 暴力破解
// constructor.setAccessible(true);

// 3. 调用构造器创建实例
Emp empInstance = constructor.newInstance();
```

#### 3.3 操作属性 (Field)

-   **目的**: 读写对象的成员变量。
-   **核心 API**:
    -   `getDeclaredField(String name)`
    -   `field.setAccessible(true)`: 破解私有属性。
    -   `field.set(Object obj, Object value)`: 为指定对象的该属性**赋值**。
    -   `field.get(Object obj)`: 获取指定对象的该属性的**值**。

```java
// ... 接上文 empInstance ...

// 1. 获取名为 "username" 的属性
Field usernameField = empClass.getDeclaredField("username");

// 2. (如果属性是私有的) 暴力破解
// usernameField.setAccessible(true);

// 3. 为 empInstance 对象的 usernameField 属性赋值
usernameField.set(empInstance, "admin_reflect");

// 4. 获取 empInstance 对象的 usernameField 属性的值
Object usernameValue = usernameField.get(empInstance);
System.out.println(usernameValue); // 输出: admin_reflect
```
#### 3.4 操作方法 (Method)

-   **目的**: 调用对象的任意方法。
-   **核心 API**:
    -   `getDeclaredMethod(String name, Class<?>... parameterTypes)`
    -   `method.setAccessible(true)`: 破解私有方法。
    -   `method.invoke(Object obj, Object... args)`: 在指定对象 `obj` 上调用该方法，并传入参数 `args`。

```java
// ... 接上文 empInstance ...

// 1. 获取名为 "login"，无参数的方法
Method loginMethod = empClass.getDeclaredMethod("login");

// 2. (如果方法是私有的) 暴力破解
// loginMethod.setAccessible(true);

// 3. 在 empInstance 对象上调用 loginMethod 方法
// invoke 方法的返回值就是原方法的返回值
Object result = loginMethod.invoke(empInstance);

System.out.println("Login result: " + result); // 输出: Login result: true
```

---

### 4. 反射与类加载器 (ClassLoader)

> [!info] 类加载器 (ClassLoader)
> 类加载器负责将 `.class` 文件的字节码加载到内存中，并转换为一个 `java.lang.Class` 对象。

Java的类加载器采用**双亲委派模型 (Parents Delegation Model)**，形成了三层结构：

1.  **启动类加载器 (Bootstrap ClassLoader)**:
    -   最顶层的加载器，由C++实现，内嵌在JVM中。
    -   负责加载Java核心库（`JAVA_HOME/lib`目录下的类，如`String`, `Object`）。
    -   Java程序无法直接获取到它的引用，通常返回 `null`。

2.  **平台类加载器 (Platform ClassLoader)**:
    -   负责加载Java平台相关的扩展类库。

3.  **应用程序类加载器 (Application/System ClassLoader)**:
    -   我们自己编写的类，默认由它加载。
    -   `ClassLoader.getSystemClassLoader()` 返回的就是它。

**双亲委派机制**:
当一个类加载器收到加载类的请求时，它首先不会自己去尝试加载，而是把这个请求**委派给父加载器**去完成。每一层的加载器都是如此，因此所有的加载请求最终都会传送到顶层的启动类加载器。只有当父加载器反馈自己无法完成这个加载请求（在它的搜索范围内没有找到所需的类）时，子加载器才会尝试自己去加载。

```java
Class<Student> studentClass = Student.class;
ClassLoader classLoader = studentClass.getClassLoader();

// 应用程序类加载器
System.out.println(classLoader);
// 平台类加载器
System.out.println(classLoader.getParent());
// 启动类加载器 (返回 null)
System.out.println(classLoader.getParent().getParent());

// String 类由启动类加载器加载，所以返回 null
System.out.println(String.class.getClassLoader());
```
---

### 5. 反射的常见异常

使用反射时，由于操作的合法性在编译期无法检查，因此会引入一些特定的受检异常。

-   `ClassNotFoundException`: `Class.forName()` 时，若在classpath中找不到指定的类，则抛出。
-   `NoSuchFieldException`: 当试图获取一个不存在的属性时抛出。
-   `NoSuchMethodException`: 当试图获取一个不存在的方法或构造器时抛出。
-   `IllegalAccessException`: 当没有足够权限访问（如直接访问私有成员而未 `setAccessible(true)`）时抛出。
-   `InstantiationException`: 当试图实例化一个抽象类或接口时抛出。
-   `InvocationTargetException`: 当通过反射调用的方法**内部本身抛出了异常**时，反射机制会将这个原始异常包装在 `InvocationTargetException` 中再抛出。可以通过 `getCause()` 方法获取原始异常。