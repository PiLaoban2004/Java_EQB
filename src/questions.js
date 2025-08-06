export const questions = [
  {
    "id": 1,
    "type": "single",
    "question": "根据Java命名规范，以下哪个是合法的常量名？",
    "options": ["maxValue", "max_value", "MAX_VALUE", "MaxValue"],
    "answer": "MAX_VALUE",
    "score": 1,
    "explanation": "根据Java命名规范，常量名所有字母都大写，单词之间用下划线分隔。"
  },
  {
    "id": 2,
    "type": "short_answer",
    "question": "请简述面向对象的三大特性，并用一句话解释它们的核心思想。",
    "answer": "封装、继承、多态。封装是隐藏实现细节；继承是复用现有代码；多态是允许不同类的对象对同一消息做出响应。",
    "score": 3,
    "explanation": "这是考察面向对象编程（OOP）最基本的概念，是理解Java设计模式和框架的基础。"
  },
  {
    "id": 3,
    "type": "multiple",
    "question": "以下关于`hashCode()`和`equals()`方法的说法，哪些是正确的？",
    "options": [
      "如果两个对象`equals()`相等，它们的`hashCode()`必须相等。",
      "如果两个对象的`hashCode()`相等，它们`equals()`不一定相等。",
      "重写`equals()`方法时，必须重写`hashCode()`方法。",
      "`Object`类的`hashCode()`默认返回对象的内存地址。"
    ],
    "answer": [
      "如果两个对象`equals()`相等，它们的`hashCode()`必须相等。",
      "如果两个对象的`hashCode()`相等，它们`equals()`不一定相等。",
      "重写`equals()`方法时，必须重写`hashCode()`方法。"
    ],
    "score": 4,
    "explanation": "这是HashMap、HashSet等集合正常工作的基石。`Object`的`hashCode`返回的是根据内存地址计算出的一个整数，并不直接是内存地址。违反这些约定会导致集合行为异常。"
  },
  {
    "id": 4,
    "type": "code",
    "question": "如何使用Java 8的Stream API，找出一个`List<String>`中所有长度大于5的字符串，并转换成大写，最后用逗号连接成一个字符串？请写出核心代码。",
    "answer": "list.stream().filter(s -> s.length() > 5).map(String::toUpperCase).collect(Collectors.joining(\",\"));",
    "score": 3.5,
    "explanation": "考察对Stream API中核心中间操作（filter, map）和终端操作（collect）的熟练运用，这是现代Java开发的常用“代码配方”。"
  },
{
    "id": 5,
    "type": "single",
    "question": "在JVM内存模型中，哪个区域是线程私有的？",
    "options": ["堆（Heap）", "方法区（Method Area）", "Java虚拟机栈（JVM Stack）", "运行时常量池"],
    "answer": "Java虚拟机栈（JVM Stack）",
    "score": 2,
    "explanation": "JVM内存分为线程共享（堆、方法区）和线程私有（虚拟机栈、本地方法栈、程序计数器）。每个线程在创建时都会创建一个虚拟机栈。"
  },
  {
    "id": 6,
    "type": "short_answer",
    "question": "什么是`ConcurrentModificationException`？在什么场景下会触发？如何避免？",
    "answer": "并发修改异常。当使用迭代器（如for-each循环）遍历一个集合时，如果同时通过集合本身的方法（如add, remove）修改了集合的结构，就会抛出此异常。应该使用迭代器自身的`remove()`方法进行删除，或者使用并发集合类`CopyOnWriteArrayList`。",
    "score": 4,
    "explanation": "这是典型的“错误与解决方案日志”类问题，考察对集合迭代器Fail-Fast机制的理解。"
  },
  {
    "id": 7,
    "type": "single",
    "question": "在Spring Boot中，哪个注解可以将一个类标记为处理HTTP请求的控制器？",
    "options": ["@Service", "@Component", "@Repository", "@RestController"],
    "answer": "@RestController",
    "score": 1.5,
    "explanation": "`@RestController`是`@Controller`和`@ResponseBody`的组合注解，是构建RESTful Web服务的标准方式。"
  },
  {
    "id": 8,
    "type": "true_false",
    "question": "`ArrayList`的查询操作（get）的时间复杂度是O(1)，而增删操作（add/remove）的平均时间复杂度是O(n)。",
    "answer": "true",
    "score": 2,
    "explanation": "`ArrayList`底层是动态数组，通过索引访问非常快。增删操作需要移动后续元素，因此时间复杂度与元素数量有关。"
  },
  {
    "id": 9,
    "type": "short_answer",
    "question": "请解释Spring框架中的IoC（控制反转）和DI（依赖注入）是什么关系？",
    "answer": "IoC（Inversion of Control）是一种设计思想，指将创建和管理对象的控制权从程序代码中转移到外部容器（Spring容器）。DI（Dependency Injection）是实现IoC的一种具体方式，容器在创建Bean时，会主动将其依赖的其他Bean注入进去。",
    "score": 3,
    "explanation": "这是理解Spring核心思想的关键，考察对框架设计理念的掌握程度。"
  },
  {
    "id": 10,
    "type": "single",
    "question": "在使用`try-with-resources`语句时，资源对象需要实现哪个接口？",
    "options": ["java.io.Serializable", "java.lang.AutoCloseable", "java.lang.Runnable", "java.util.Comparator"],
    "answer": "java.lang.AutoCloseable",
    "score": 2.5,
    "explanation": "`try-with-resources`是Java 7引入的语法糖，用于自动关闭资源。它的工作原理就是调用实现了`AutoCloseable`接口的对象的`close()`方法。"
  },
  {
    "id": 11,
    "type": "single",
    "question": "HashMap的默认初始容量和默认加载因子分别是多少？",
    "options": ["16, 0.75f", "8, 0.5f", "32, 1.0f", "16, 1.0f"],
    "answer": "16, 0.75f",
    "score": 1.5,
    "explanation": "HashMap的性能受初始容量和加载因子的影响。当`size >= capacity * loadFactor`时，会进行扩容。"
  },
  {
    "id": 12,
    "type": "short_answer",
    "question": "描述一下`HashMap`在JDK 1.8中为了解决哈希冲突做了哪些优化？",
    "answer": "主要优化是当链表长度超过一个阈值（默认为8）并且数组长度大于等于64时，会将链表转化为红黑树，以将查询时间复杂度从O(n)降低到O(log n)。",
    "score": 4,
    "explanation": "这是深入考察`HashMap`底层原理的常见问题，体现了对数据结构和性能优化的理解。"
  },
  {
    "id": 13,
    "type": "single",
    "question": "在Java中，`String a = new String(\"abc\");` 这行代码创建了几个String对象？",
    "options": ["0个", "1个", "2个", "不确定"],
    "answer": "2个",
    "score": 3,
    "explanation": "一个是在字符串常量池中的\"abc\"（如果池中没有的话），另一个是在堆上通过`new`关键字创建的String对象。这是考察JVM内存与String对象创建的经典问题。"
  },
  {
    "id": 14,
    "type": "single",
    "question": "以下哪个关键字可以保证多线程环境下变量的可见性，但不能保证原子性？",
    "options": ["synchronized", "final", "static", "volatile"],
    "answer": "volatile",
    "score": 3,
    "explanation": "`volatile`关键字保证了当一个线程修改了共享变量的值，新值对其他线程是立即可见的。但它不保证复合操作（如 i++）的原子性。"
  },
  {
    "id": 15,
    "type": "short_answer",
    "question": "在Git中，`git rebase` 和 `git merge` 的主要区别是什么？你应该在什么场景下使用`rebase`？",
    "answer": "主要区别在于`merge`会保留分叉的历史，创建一个新的合并提交；而`rebase`会将你的提交“变基”到目标分支的最新点，形成一条线性的提交历史。通常在同步个人开发分支与主分支的更新时使用`rebase`，以保持提交历史的整洁。",
    "score": 3.5,
    "explanation": "考察对Git工作流的理解，这是“工具与环境配置”笔记的实际应用。"
  },
  {
    "id": 16,
    "type": "multiple",
    "question": "下列哪些是Java中的Checked Exception（受检异常）？",
    "options": ["NullPointerException", "IOException", "ClassNotFoundException", "ArrayIndexOutOfBoundsException"],
    "answer": ["IOException", "ClassNotFoundException"],
    "score": 2.5,
    "explanation": "Checked Exception是编译器要求必须处理（try-catch或throws）的异常。`RuntimeException`及其子类（如NPE、数组越界）属于Unchecked Exception。"
  },
  {
    "id": 17,
    "type": "single",
    "question": "Spring Boot的核心优点之一“自动配置”是基于哪个注解实现的？",
    "options": ["@ComponentScan", "@SpringBootApplication", "@EnableAutoConfiguration", "@Configuration"],
    "answer": "@EnableAutoConfiguration",
    "score": 2,
    "explanation": "`@SpringBootApplication`注解其实是一个组合注解，其中就包含了`@EnableAutoConfiguration`，它负责根据classpath下的jar包来猜测并配置你需要的Bean。"
  },
  {
    "id": 18,
    "type": "short_answer",
    "question": "什么是JVM的垃圾回收（GC）？请列举至少两种GC Roots。",
    "answer": "垃圾回收是JVM自动管理内存的机制，它会自动识别并清除不再被使用的对象。常见的GC Roots包括：虚拟机栈中引用的对象、方法区中静态属性引用的对象、方法区中常量引用的对象、本地方法栈中JNI引用的对象。",
    "score": 4,
    "explanation": "考察对JVM自动内存管理核心概念的理解，这是排查内存泄漏问题的基础。"
  },
  {
    "id": 19,
    "type": "single",
    "question": "Lombok库中的哪个注解可以自动生成类的getter、setter、equals、hashCode和toString方法？",
    "options": ["@Getter", "@Setter", "@Data", "@Builder"],
    "answer": "@Data",
    "score": 1.5,
    "explanation": "`@Data`是一个便捷的组合注解，相当于`@Getter`, `@Setter`, `@RequiredArgsConstructor`, `@ToString`, `@EqualsAndHashCode`的集合，是典型的“代码配方”。"
  },
  {
    "id": 20,
    "type": "code",
    "question": "请编写一个简单的Java单例模式（Singleton）实现，要求线程安全且使用懒汉式加载。",
    "answer": "public class Singleton { private static volatile Singleton instance; private Singleton() {} public static Singleton getInstance() { if (instance == null) { synchronized (Singleton.class) { if (instance == null) { instance = new Singleton(); } } } return instance; } }",
    "score": 4.5,
    "explanation": "考察设计模式和并发编程的结合。这被称为“双重检查锁定（DCL）”，需要使用`volatile`关键字防止指令重排序，是线程安全懒汉式的经典实现。"
  },
  {
    "id": 21,
    "type": "single",
    "question": "在Java中，`final`, `finally`, `finalize`三者有何不同？哪个用于异常处理？",
    "options": ["`final`用于异常处理", "`finally`用于异常处理", "`finalize`用于异常处理", "它们都与异常处理有关"],
    "answer": "`finally`用于异常处理",
    "score": 2.5,
    "explanation": "`final`是修饰符（类、方法、变量）。`finally`是异常处理结构的一部分，确保代码块总是被执行。`finalize`是`Object`的方法，在对象被GC前调用，不推荐使用。"
  },
  {
    "id": 22,
    "type": "single",
    "question": "哪一个集合类是线程安全的，并且读操作无锁，写操作通过复制底层数组实现？",
    "options": ["ArrayList", "Vector", "ConcurrentHashMap", "CopyOnWriteArrayList"],
    "answer": "CopyOnWriteArrayList",
    "score": 3,
    "explanation": "这是并发集合中的一个重要实现，适用于“读多写少”的场景。读操作不加锁，性能高；写操作（add, set, remove）通过加锁并创建一个新数组来保证线程安全。"
  },
  {
    "id": 23,
    "type": "short_answer",
    "question": "解释一下什么是Spring的AOP（面向切面编程）？它主要解决了什么问题？",
    "answer": "AOP是一种编程范式，它允许开发者定义横切关注点（如日志、事务、安全检查）并将它们模块化。它主要解决了在多个不相关的业务逻辑中存在大量重复代码的问题，通过将这些通用功能“织入”到业务代码中，实现了代码的解耦和复用。",
    "score": 3.5,
    "explanation": "这是Spring的另一个核心概念。理解AOP有助于理解Spring事务管理等功能的实现原理。"
  },
  {
    "id": 24,
    "type": "true_false",
    "question": "在Maven项目中，`pom.xml`文件用于定义项目信息、依赖关系和插件配置。",
    "answer": "true",
    "score": 1,
    "explanation": "`pom.xml` (Project Object Model) 是Maven项目的核心配置文件，是管理Java项目的标准方式之一。"
  },
  {
    "id": 25,
    "type": "single",
    "question": "HTTP状态码404代表什么？",
    "options": ["请求成功", "服务器内部错误", "未找到资源", "未授权"],
    "answer": "未找到资源",
    "score": 1,
    "explanation": "这是最常见的HTTP状态码之一。4xx系列表示客户端错误，404 Not Found表示服务器无法根据客户端的请求找到资源。"
  },
  {
    "id": 26,
    "type": "single",
    "question": "Java的8种基本数据类型中，不包括以下哪一个？",
    "options": ["int", "double", "char", "String"],
    "answer": "String",
    "score": 1,
    "explanation": "`String`是Java中的一个类，属于引用数据类型，而不是基本数据类型。"
  },
  {
    "id": 27,
    "type": "short_answer",
    "question": "在Java中，`==` 和 `equals()` 方法有什么区别？对于包装类Integer，请举例说明。",
    "answer": "`==`对于基本类型比较的是值，对于引用类型比较的是内存地址。`equals()`默认比较内存地址，但许多类（如String, Integer）重写了它来比较内容。例如：`Integer a = 127; Integer b = 127; a == b`为true（因为缓存）。`Integer c = 128; Integer d = 128; c == d`为false（超出缓存范围，new了新对象）。但`c.equals(d)`为true。",
    "score": 3.5,
    "explanation": "这是一个非常经典的面试题，综合考察了基本类型、引用类型、自动装箱和包装类缓存机制。"
  },
  {
    "id": 28,
    "type": "single",
    "question": "Java线程池的核心参数不包括以下哪个？",
    "options": ["corePoolSize", "maximumPoolSize", "keepAliveTime", "threadNamePrefix"],
    "answer": "threadNamePrefix",
    "score": 2,
    "explanation": "`ThreadPoolExecutor`的构造函数核心参数主要包括核心线程数、最大线程数、保持存活时间、时间单位、工作队列和线程工厂。线程名称前缀通常在创建`ThreadFactory`时设置，不是直接的核心参数。"
  },
  {
    "id": 29,
    "type": "code",
    "question": "如果一个Maven项目出现依赖冲突（例如，引入了两个不同版本的同一个jar包），你会如何排查？请写出一个常用的Maven命令。",
    "answer": "使用 `mvn dependency:tree` 命令可以打印出项目的整个依赖树，通过分析树状结构，可以清晰地看到哪个依赖引入了冲突的版本。然后可以在`pom.xml`中使用`<dependencyManagement>`或`<exclusions>`来解决。",
    "score": 3,
    "explanation": "这是解决“Maven依赖冲突”问题的标准流程，属于“错误与解决方案日志”和“工具与环境配置”的交叉领域。"
  },
  {
    "id": 30,
    "type": "single",
    "question": "哪一个Spring注解用于开启对Spring事务管理功能的支持？",
    "options": ["@Transactional", "@EnableTransactionManagement", "@EnableAspectJAutoProxy", "@Configuration"],
    "answer": "@EnableTransactionManagement",
    "score": 2.5,
    "explanation": "`@EnableTransactionManagement`通常用在配置类上，用于启用基于注解的事务管理功能。而`@Transactional`则用在具体的方法或类上，以声明该部分代码需要事务支持。"
  },
  {
    "id": 31,
    "type": "single",
    "question": "`ArrayList`和`LinkedList`的主要区别是什么？",
    "options": [
      "`ArrayList`线程安全，`LinkedList`线程不安全",
      "`ArrayList`基于数组，`LinkedList`基于链表",
      "`ArrayList`只能存数字，`LinkedList`只能存字符串",
      "`ArrayList`查询慢，`LinkedList`查询快"
    ],
    "answer": "`ArrayList`基于数组，`LinkedList`基于链表",
    "score": 2,
    "explanation": "这是它们最本质的区别，这个区别决定了它们的性能特点：ArrayList查询快、增删慢；LinkedList查询慢、头尾增删快。"
  },
  {
    "id": 32,
    "type": "short_answer",
    "question": "Java中的`super`关键字有什么作用？",
    "answer": "`super`关键字主要有两个作用：1. 在子类的构造方法中调用父类的构造方法（必须是第一行）。2. 在子类中访问被子类重写（override）的父类的方法或被隐藏的父类的字段。",
    "score": 2,
    "explanation": "考察对继承（Inheritance）这一核心概念的理解深度。"
  },
  {
    "id": 33,
    "type": "single",
    "question": "下面哪种方法不能创建一个Java线程？",
    "options": [
      "继承`Thread`类并重写`run()`方法",
      "实现`Runnable`接口并实现`run()`方法",
      "实现`Callable`接口并结合`FutureTask`",
      "直接调用一个对象的`run()`方法"
    ],
    "answer": "直接调用一个对象的`run()`方法",
    "score": 2.5,
    "explanation": "直接调用`run()`方法只是一个普通的方法调用，它会在当前线程中执行，并不会启动一个新的线程。必须调用`Thread`对象的`start()`方法才能启动新线程。"
  },
  {
    "id": 34,
    "type": "short_answer",
    "question": "解释什么是Dockerfile，并列出至少三个常用指令。",
    "answer": "Dockerfile是一个文本文件，包含了一系列指令和参数，用于自动构建Docker镜像。常用指令包括：`FROM`（指定基础镜像）、`COPY`或`ADD`（复制文件到镜像中）、`RUN`（在镜像构建过程中执行命令）、`CMD`或`ENTRYPOINT`（指定容器启动时执行的命令）。",
    "score": 3,
    "explanation": "这是对“工具与环境配置”模块中容器化技术的考察，是现代后端开发的必备技能。"
  },
  {
    "id": 35,
    "type": "true_false",
    "question": "在Spring中，默认的Bean作用域（Scope）是`prototype`。",
    "answer": "false",
    "score": 1.5,
    "explanation": "Spring Bean的默认作用域是`singleton`，即在整个Spring容器中，该Bean只有一个实例。"
  },
  {
    "id": 36,
    "type": "single",
    "question": "以下哪个数据结构不能保证元素的插入顺序？",
    "options": ["ArrayList", "LinkedList", "LinkedHashSet", "HashSet"],
    "answer": "HashSet",
    "score": 2,
    "explanation": "`ArrayList`和`LinkedList`是有序的。`LinkedHashSet`在`HashSet`的基础上维护了一个链表来保证插入顺序。`HashSet`是无序的，它的顺序由哈希值决定。"
  },
  {
    "id": 37,
    "type": "code",
    "question": "在使用JDBC时，如果不使用`try-with-resources`，标准的关闭`Connection`, `Statement`, `ResultSet`的顺序是什么？为什么？",
    "answer": "应该在`finally`块中以后进先出（LIFO）的顺序关闭：先关`ResultSet`，再关`Statement`，最后关`Connection`。因为`Statement`依赖于`Connection`创建，`ResultSet`依赖于`Statement`创建，先关闭依赖的源头可能会导致被依赖的对象无法正常关闭。",
    "score": 3,
    "explanation": "考察Java基础IO和异常处理的编码规范，这也是`try-with-resources`解决的核心痛点之一。"
  },
  {
    "id": 38,
    "type": "single",
    "question": "关于Java中的`final`关键字，以下说法错误的是？",
    "options": [
      "`final`修饰的类不能被继承",
      "`final`修饰的方法不能被重写",
      "`final`修饰的变量是常量，值不能被改变",
      "`final`修饰的局部变量必须在声明时初始化"
    ],
    "answer": "`final`修饰的局部变量必须在声明时初始化",
    "score": 2.5,
    "explanation": "`final`修饰的局部变量可以不在声明时初始化，但只能被赋值一次。`final`修饰的成员变量必须在声明时或构造函数中初始化。对于`final`修饰的引用变量，是引用地址不能变，但对象本身的内容可以变。"
  },
  {
    "id": 39,
    "type": "short_answer",
    "question": "什么是Java的泛型（Generics）？它提供了什么好处？",
    "answer": "泛型是Java 5引入的特性，允许在定义类、接口和方法时使用类型参数。主要好处有两个：1. 类型安全，在编译时就能检查出类型不匹配的错误，而不是在运行时抛出`ClassCastException`。2. 代码重用，可以编写更通用的算法和数据结构，避免了对`Object`的强制类型转换。",
    "score": 3,
    "explanation": "考察对Java核心语法特性的理解，泛型在集合框架和许多现代库中被广泛使用。"
  },
  {
    "id": 40,
    "type": "single",
    "question": "`sleep()` 和 `wait()` 方法的主要区别是什么？",
    "options": [
      "`sleep()`释放锁, `wait()`不释放锁",
      "`sleep()`是`Thread`类的方法, `wait()`是`Object`类的方法",
      "`sleep()`必须在同步块中使用, `wait()`可以在任何地方使用",
      "它们没有区别"
    ],
    "answer": "`sleep()`是`Thread`类的方法, `wait()`是`Object`类的方法",
    "score": 3,
    "explanation": "最本质的区别在于：1. 所属类不同。2. `sleep()`不会释放对象锁，而`wait()`会释放对象锁并进入等待队列。3. `wait()`必须在同步代码块或同步方法中调用，而`sleep()`可以在任何地方调用。"
  },
  {
    "id": 41,
    "type": "single",
    "question": "在Spring Boot的`application.properties`或`application.yml`文件中，配置服务器端口的属性名是什么？",
    "options": ["http.port", "application.port", "server.port", "port"],
    "answer": "server.port",
    "score": 1,
    "explanation": "这是Spring Boot中最常用的配置项之一，属于“工具与环境配置”笔记的内容。"
  },
  {
    "id": 42,
    "type": "short_answer",
    "question": "描述一下Java的类加载过程（Class Loading）的主要阶段。",
    "answer": "主要包括三个阶段：1. 加载（Loading）：通过类加载器将`.class`文件的二进制流读入内存，并创建`java.lang.Class`对象。2. 链接（Linking）：包括验证（Verification）、准备（Preparation，为静态变量分配内存并设置零值）、解析（Resolution，符号引用转为直接引用）。3. 初始化（Initialization）：执行类构造器`<clinit>()`方法，为静态变量赋初始值。",
    "score": 4.5,
    "explanation": "这是深入理解JVM运行机制的关键，考察对底层原理的掌握。"
  },
  {
    "id": 43,
    "type": "single",
    "question": "在Java并发编程中，`synchronized`关键字不能用于修饰什么？",
    "options": ["实例方法", "静态方法", "代码块", "构造方法"],
    "answer": "构造方法",
    "score": 2,
    "explanation": "构造方法本身就是线程安全的，因为它在对象创建时由单个线程调用。`synchronized`用于控制对已有对象的并发访问，对构造方法加锁没有意义。"
  },
  {
    "id": 44,
    "type": "multiple",
    "question": "以下哪些属于Java 8引入的新特性？",
    "options": ["Lambda表达式", "Stream API", "Optional类", "自动装箱"],
    "answer": ["Lambda表达式", "Stream API", "Optional类"],
    "score": 2,
    "explanation": "Lambda表达式、Stream API、Optional类以及新的日期时间API都是Java 8的标志性新特性。自动装箱/拆箱是Java 5引入的。"
  },
  {
    "id": 45,
    "type": "short_answer",
    "question": "什么是`NullPointerException`（NPE）？请列举至少两种预防NPE的编码实践。",
    "answer": "空指针异常，发生在尝试使用一个值为`null`的引用变量来调用实例方法或访问实例字段时。预防实践：1. 在使用对象前进行null检查。2. 使用`java.util.Optional`包装可能为null的对象。3. 对于字符串比较，使用`\"literal\".equals(variable)`而不是`variable.equals(\"literal\")`。",
    "score": 2.5,
    "explanation": "这是Java开发中最常见的运行时异常，考察编码的健壮性和防御性编程思想。"
  },
  {
    "id": 46,
    "type": "single",
    "question": "在标准的RESTful API设计中，使用哪个HTTP方法来表示“创建一个新资源”？",
    "options": ["GET", "POST", "PUT", "DELETE"],
    "answer": "POST",
    "score": 1.5,
    "explanation": "RESTful风格中，`POST`用于创建资源，`GET`用于读取资源，`PUT`用于更新整个资源，`PATCH`用于部分更新，`DELETE`用于删除资源。"
  },
  {
    "id": 47,
    "type": "true_false",
    "question": "Java中的`String`类是可变的（Mutable）。",
    "answer": "false",
    "score": 2,
    "explanation": "`String`类被`final`修饰，其内部的`char`数组也是`final`的，因此String对象一旦创建，其内容就不可改变。所有看似修改String的操作（如`+`，`substring`）实际上都是创建了新的String对象。"
  },
  {
    "id": 48,
    "type": "code",
    "question": "请写出使用`java.util.concurrent.ExecutorService`创建一个固定大小为5的线程池的代码。",
    "answer": "ExecutorService executor = Executors.newFixedThreadPool(5);",
    "score": 2,
    "explanation": "这是使用Java并发包中线程池的“代码配方”，`Executors`工厂类提供了多种便捷的创建线程池的方法。"
  },
  {
    "id": 49,
    "type": "single",
    "question": "在JVM的垃圾回收算法中，哪一种算法会产生内存碎片？",
    "options": ["标记-清除（Mark-Sweep）", "复制（Copying）", "标记-整理（Mark-Compact）", "分代收集（Generational Collection）"],
    "answer": "标记-清除（Mark-Sweep）",
    "score": 3,
    "explanation": "标记-清除算法在清除死亡对象后，不会移动存活对象，因此会留下不连续的内存空间，即内存碎片。复制算法和标记-整理算法都能解决碎片问题。"
  },
  {
    "id": 50,
    "type": "short_answer",
    "question": "解释一下`ThreadLocal`的作用和原理。",
    "answer": "`ThreadLocal`提供了一种线程局部变量的解决方案。它为每个使用该变量的线程都提供一个独立的变量副本，从而做到了线程隔离，避免了多线程间的数据竞争。其原理是每个`Thread`对象内部都有一个`ThreadLocalMap`，key是`ThreadLocal`实例，value是该线程设置的变量副本。",
    "score": 4.5,
    "explanation": "这是并发编程中的一个高级主题，常用于在同一线程的不同方法间传递数据，例如数据库连接、用户信息等。"
  },
  {
    "id": 51,
    "type": "single",
    "question": "Java中，抽象类（Abstract Class）和接口（Interface）的主要区别是什么？",
    "options": [
      "抽象类可以有构造方法，接口不能",
      "一个类只能继承一个抽象类，但可以实现多个接口",
      "抽象类可以有成员变量，接口只能有常量",
      "以上所有都是"
    ],
    "answer": "以上所有都是",
    "score": 2.5,
    "explanation": "在JDK 8之前，这些都是经典区别。JDK 8后接口可以有默认方法和静态方法，JDK9后可以有私有方法，但上述核心区别依然成立。"
  },
  {
    "id": 52,
    "type": "single",
    "question": "当`HashMap`的键是一个自定义对象时，为了保证其正常工作，该自定义对象必须重写哪两个方法？",
    "options": ["toString() 和 clone()", "equals() 和 hashCode()", "compareTo() 和 equals()", "get() 和 put()"],
    "answer": "equals() 和 hashCode()",
    "score": 2,
    "explanation": "`HashMap`通过`hashCode()`确定存储位置，通过`equals()`解决哈希冲突和判断键是否已存在。不正确地重写这两个方法会导致`HashMap`工作异常。"
  },
  {
    "id": 53,
    "type": "short_answer",
    "question": "什么是Java中的反射（Reflection）机制？它有什么优缺点？",
    "answer": "反射是在运行时动态地获取任意一个类的信息（如成员变量、构造器、方法）并能调用其方法或操作其属性的机制。优点是极大地增加了程序的灵活性和扩展性，是许多框架（如Spring）的底层基础。缺点是性能开销较大，且破坏了类的封装性，容易导致安全问题。",
    "score": 3.5,
    "explanation": "考察对Java高级特性的理解，反射是理解框架原理的钥匙。"
  },
  {
    "id": 54,
    "type": "single",
    "question": "哪一个集合类既保证了元素的唯一性，又保证了元素的插入顺序？",
    "options": ["HashSet", "TreeSet", "ArrayList", "LinkedHashSet"],
    "answer": "LinkedHashSet",
    "score": 2.5,
    "explanation": "`HashSet`保证唯一但无序。`TreeSet`保证唯一且按自然顺序或比较器顺序排序。`ArrayList`不保证唯一。`LinkedHashSet`通过哈希表和链表结合，同时满足了唯一性和插入顺序的要求。"
  },
  {
    "id": 55,
    "type": "true_false",
    "question": "在`synchronized`修饰一个静态方法时，它获取的锁是该类的`Class`对象。",
    "answer": "true",
    "score": 3,
    "explanation": "同步静态方法锁的是类对象（`ClassName.class`），而同步非静态方法锁的是`this`，即当前实例对象。这是两种不同的锁。"
  },
  {
    "id": 56,
    "type": "short_answer",
    "question": "在IntelliJ IDEA中，重构代码（如修改变量名、提取方法）的快捷键是什么（Windows/Linux通用）？",
    "answer": "通常是 `Ctrl + Alt + Shift + T` (Refactor This) 调出重构菜单，或者针对性的如 `Shift + F6` (Rename), `Ctrl + Alt + M` (Extract Method)。",
    "score": 1.5,
    "explanation": "考察对IDE工具的熟练度，高效的开发者善于使用IDE的重构功能，属于“工具与环境配置”笔记。"
  },
  {
    "id": 57,
    "type": "single",
    "question": "在Spring的依赖注入中，`@Autowired`和`@Resource`注解的主要区别是什么？",
    "options": [
      "`@Autowired`是Spring的, `@Resource`是JSR-250规范的",
      "`@Autowired`默认按类型装配, `@Resource`默认按名称装配",
      "它们没有区别",
      "A和B都正确"
    ],
    "answer": "A和B都正确",
    "score": 3.5,
    "explanation": "这是两者最核心的区别。`@Autowired`（Spring）默认是`byType`，如果发现多个同类型Bean会尝试`byName`。`@Resource`(Java EE)默认是`byName`，如果找不到会回退到`byType`。"
  },
  {
    "id": 58,
    "type": "code",
    "question": "有一个`List<Integer>`，请使用Java 8 Stream API计算其中所有偶数的和。",
    "answer": "list.stream().filter(n -> n % 2 == 0).mapToInt(Integer::intValue).sum();",
    "score": 3,
    "explanation": "考察Stream API的组合使用，特别是`mapToInt`这类原始类型Stream的优化，它可以避免自动装箱拆箱的开销，并提供了`sum()`等便捷方法。"
  },
  {
    "id": 59,
    "type": "single",
    "question": "JVM中，哪个区域可能会发生`StackOverflowError`？",
    "options": ["堆（Heap）", "方法区（Method Area）", "Java虚拟机栈（JVM Stack）", "直接内存"],
    "answer": "Java虚拟机栈（JVM Stack）",
    "score": 2,
    "explanation": "当线程请求的栈深度大于虚拟机所允许的深度时（通常是由于无限递归调用），就会抛出`StackOverflowError`。"
  },
  {
    "id": 60,
    "type": "short_answer",
    "question": "解释Java中的强引用、软引用、弱引用和虚引用的区别。",
    "answer": "强引用（Strong）：最常见的引用，只要强引用存在，GC绝不会回收。软引用（Soft）：内存不足时GC会回收。弱引用（Weak）：只要发生GC就会回收。虚引用（Phantom）：主要用于跟踪对象被GC回收的状态，必须和引用队列联合使用。",
    "score": 5,
    "explanation": "这是Java内存管理的高级话题，理解它们有助于编写更健壮的缓存系统或处理大对象。"
  },
  {
    "id": 61,
    "type": "single",
    "question": "在多线程环境中，为了保证`i++`操作的原子性，应该使用以下哪个类？",
    "options": ["Integer", "Long", "AtomicInteger", "Double"],
    "answer": "AtomicInteger",
    "score": 2.5,
    "explanation": "`i++`不是原子操作，它包含读、改、写三步。`java.util.concurrent.atomic`包下的原子类（如`AtomicInteger`），通过CAS（Compare-And-Swap）操作来保证这类复合操作的原子性。"
  },
  {
    "id": 62,
    "type": "single",
    "question": "如果想在Spring Boot应用启动后执行一些初始化代码，应该实现哪个接口？",
    "options": ["InitializingBean", "CommandLineRunner", "ApplicationContextAware", "BeanPostProcessor"],
    "answer": "CommandLineRunner",
    "score": 2,
    "explanation": "在Spring Boot中，实现`CommandLineRunner`或`ApplicationRunner`接口是执行启动后逻辑的最佳实践。`InitializingBean`是Spring框架的老方法，虽然可用但不推荐。"
  },
  {
    "id": 63,
    "type": "short_answer",
    "question": "什么是TCP的“三次握手”？",
    "answer": "是TCP建立连接的过程。1. 客户端发送SYN包到服务器。2. 服务器收到SYN包，回复一个SYN+ACK包。3. 客户端收到SYN+ACK包，再发送一个ACK包，连接建立。",
    "score": 3,
    "explanation": "虽然不是纯Java问题，但网络编程是后端开发的基础，也是面试常考点。"
  },
  {
    "id": 64,
    "type": "true_false",
    "question": "Java的`Object`类是所有类的直接或间接父类。",
    "answer": "true",
    "score": 1,
    "explanation": "Java中所有的类，如果没有明确指定父类，都默认继承自`java.lang.Object`类。"
  },
  {
    "id": 66,
    "type": "single",
    "question": "如果你想让一个Maven依赖只在编译和测试阶段有效，在运行时不需要，应该使用哪个scope？",
    "options": ["compile", "provided", "runtime", "test"],
    "answer": "provided",
    "score": 2.5,
    "explanation": "`provided`作用域表示该依赖由JDK或容器（如Tomcat）在运行时提供。例如Servlet API。`compile`是默认值，`runtime`只在运行时需要，`test`只在测试时需要。"
  },
  {
    "id": 67,
    "type": "code",
    "question": "当服务器端口被占用（Address already in use）时，在Linux或macOS系统下，你会用什么命令来查找占用该端口的进程？",
    "answer": "使用 `lsof -i :端口号` 或者 `netstat -tuln | grep 端口号`。例如 `lsof -i :8080`。",
    "score": 2,
    "explanation": "这是典型的“错误与解决方案日志”类问题，考察的是开发环境中的实际问题解决能力。"
  },
  {
    "id": 68,
    "type": "single",
    "question": "Java中，`Error`和`Exception`的共同父类是什么？",
    "options": ["Object", "RuntimeException", "Throwable", "IOException"],
    "answer": "Throwable",
    "score": 2,
    "explanation": "在Java的异常体系中，`Throwable`是所有错误和异常的根类，它有两个主要的子类：`Error`和`Exception`。"
  },
  {
    "id": 69,
    "type": "short_answer",
    "question": "请解释什么是“依赖倒置原则”（DIP）？",
    "answer": "依赖倒置原则是SOLID原则之一。它指高层模块不应该依赖于低层模块，两者都应该依赖于抽象；抽象不应该依赖于细节，细节应该依赖于抽象。简单说就是“面向接口编程”，而不是“面向实现编程”。",
    "score": 4,
    "explanation": "考察对软件设计原则的理解，这是写出高质量、可维护、可扩展代码的理论基础。"
  },
  {
    "id": 70,
    "type": "single",
    "question": "Java的`Optional`类的主要目的是什么？",
    "options": [
      "替代`if-else`",
      "提升性能",
      "优雅地处理`null`值，避免`NullPointerException`",
      "实现函数式编程"
    ],
    "answer": "优雅地处理`null`值，避免`NullPointerException`",
    "score": 2.5,
    "explanation": "`Optional`是一个容器对象，它可能包含也可能不包含非`null`值。它的出现鼓励开发者显式地处理可能缺失值的情况，而不是留下一堆潜在的NPE。"
  },
  {
    "id": 71,
    "type": "single",
    "question": "下面哪一个不是Java线程池的状态？",
    "options": ["RUNNING", "SHUTDOWN", "TERMINATED", "PAUSED"],
    "answer": "PAUSED",
    "score": 3,
    "explanation": "ThreadPoolExecutor有五个状态：RUNNING, SHUTDOWN, STOP, TIDYING, TERMINATED。没有PAUSED状态。"
  },
  {
    "id": 72,
    "type": "short_answer",
    "question": "说一下你对`StringBuilder`、`StringBuffer`和`String`的区别的理解。",
    "answer": "1. 可变性：`String`是不可变的，而`StringBuilder`和`StringBuffer`是可变的。2. 线程安全：`StringBuffer`是线程安全的（方法加了`synchronized`），`StringBuilder`是线程不安全的。3. 性能：`StringBuilder`性能最高，`StringBuffer`次之，`String`在进行大量拼接操作时性能最差。",
    "score": 3,
    "explanation": "这是Java基础中关于字符串处理的经典面试题，考察对可变性、线程安全和性能的综合理解。"
  },
  {
    "id": 73,
    "type": "single",
    "question": "在Git中，哪个命令用于将一个或多个提交从一个分支应用到另一个分支？",
    "options": ["git revert", "git reset", "git cherry-pick", "git stash"],
    "answer": "git cherry-pick",
    "score": 2.5,
    "explanation": "`git cherry-pick`可以选择性地将指定的提交（commit）应用到当前分支，常用于在不同分支间同步特定的修复或功能。"
  },
  {
    "id": 74,
    "type": "code",
    "question": "在Spring Boot中，如何进行全局异常处理？请写出关键的注解。",
    "answer": "通常会创建一个类，并使用`@ControllerAdvice`或`@RestControllerAdvice`注解。然后在该类中定义方法，使用`@ExceptionHandler(Exception.class)`来处理特定类型的异常。",
    "score": 3,
    "explanation": "这是Spring Boot Web开发中非常重要的实践，可以统一处理应用的异常，返回规范的错误响应。"
  },
  {
    "id": 75,
    "type": "single",
    "question": "以下哪项是关于`static`关键字的错误描述？",
    "options": [
      "静态方法不能调用非静态成员变量",
      "静态方法中不能使用`this`关键字",
      "静态方法可以被子类重写（override）",
      "静态变量属于类，所有实例共享"
    ],
    "answer": "静态方法可以被子类重写（override）",
    "score": 2.5,
    "explanation": "静态方法属于类，与类绑定，不能被重写（Override），但可以被子类隐藏（Hide）。通常我们说重写是针对实例方法的多态性。"
  },
  {
    "id": 76,
    "type": "short_answer",
    "question": "JVM的“双亲委派模型”（Parents Delegation Model）是什么？它有什么好处？",
    "answer": "当一个类加载器收到类加载请求时，它首先不会自己去尝试加载，而是把这个请求委派给父类加载器去完成，层层向上委托，直到顶层的启动类加载器。只有当父加载器无法完成加载时，子加载器才会尝试自己加载。好处是：1. 避免类的重复加载。2. 保证了Java核心库的类型安全（如`java.lang.Object`永远是由启动类加载器加载）。",
    "score": 5,
    "explanation": "这是JVM类加载机制的核心，深刻理解它有助于排查`ClassNotFoundException`等问题。"
  },
  {
    "id": 77,
    "type": "single",
    "question": "在Java中，`int`和`Integer`有什么区别？",
    "options": [
      "`int`是基本数据类型, `Integer`是包装类",
      "`int`的默认值是0, `Integer`的默认值是null",
      "`Integer`可以用于泛型，`int`不行",
      "以上所有都是"
    ],
    "answer": "以上所有都是",
    "score": 2,
    "explanation": "这总结了基本数据类型和其包装类的核心区别，涉及默认值、内存存储方式以及在泛型等语法中的使用。"
  },
  {
    "id": 78,
    "type": "single",
    "question": "在Spring中，AOP的通知（Advice）类型不包括以下哪个？",
    "options": ["@Before", "@After", "@Around", "@Instead"],
    "answer": "@Instead",
    "score": 2,
    "explanation": "Spring AOP中标准的通知类型包括：`@Before`（前置通知）、`@After`（后置通知）、`@AfterReturning`（返回通知）、`@AfterThrowing`（异常通知）和`@Around`（环绕通知）。没有`@Instead`这种类型。"
  },
  {
    "id": 79,
    "type": "code",
    "question": "如何用Java代码实现一个简单的死锁？",
    "answer": "创建两个线程，让线程A先锁住资源1再请求资源2，同时让线程B先锁住资源2再请求资源1。例如： `new Thread(() -> { synchronized(lock1) { try { Thread.sleep(100); } catch (InterruptedException e) {} synchronized(lock2) { ... } } }).start(); new Thread(() -> { synchronized(lock2) { synchronized(lock1) { ... } } }).start();`",
    "score": 4,
    "explanation": "考察对死锁产生的四个必要条件（互斥、占有并等待、不可剥夺、循环等待）的理解，并能通过代码复现。"
  },
  {
    "id": 80,
    "type": "short_answer",
    "question": "简述一下Spring Bean的生命周期。",
    "answer": "大致过程包括：1. 实例化（Instantiation）。2. 属性赋值（Populate Properties）。3. 初始化（Initialization），包括调用Aware接口方法、BeanPostProcessor前置处理、`@PostConstruct`/`InitializingBean`、BeanPostProcessor后置处理。4. 使用（In Use）。5. 销毁（Destruction），包括调用`@PreDestroy`/`DisposableBean`。",
    "score": 5,
    "explanation": "这是Spring框架的高级面试题，全面考察对Bean在容器中如何被管理和运作的理解。"
  },
  {
    "id": 81,
    "type": "single",
    "question": "在Linux系统中，哪个命令用于查看实时滚动的日志文件？",
    "options": ["cat file.log", "head file.log", "grep 'error' file.log", "tail -f file.log"],
    "answer": "tail -f file.log",
    "score": 1.5,
    "explanation": "`tail -f` (`-f` for follow) 会持续监视文件末尾的新增内容并输出，非常适合查看实时生成的日志。"
  },
  {
    "id": 82,
    "type": "single",
    "question": "Java IO模型中，NIO指的是什么？",
    "options": ["Blocking IO", "Non-blocking IO", "Asynchronous IO", "Object-Oriented IO"],
    "answer": "Non-blocking IO",
    "score": 2.5,
    "explanation": "NIO (New IO) 是Java 1.4引入的，它提供了非阻塞IO的能力，基于Channel、Buffer和Selector，使得可以用单线程处理多个连接，提高了IO效率。"
  },
  {
    "id": 83,
    "type": "short_answer",
    "question": "`final`关键字修饰一个引用类型的变量，代表什么？",
    "answer": "代表这个引用变量的引用地址不能再改变，即它不能再指向另一个新的对象。但是，该引用所指向的对象本身的内容是可以被修改的。",
    "score": 3,
    "explanation": "这是对`final`关键字理解的一个常见误区。需要区分“引用不可变”和“对象不可变”。"
  },
  {
    "id": 84,
    "type": "single",
    "question": "哪一个并发工具类允许一组线程互相等待，直到所有线程都到达一个共同的屏障点？",
    "options": ["CountDownLatch", "Semaphore", "CyclicBarrier", "ReentrantLock"],
    "answer": "CyclicBarrier",
    "score": 3.5,
    "explanation": "`CyclicBarrier`（循环屏障）可以让一组线程在达到某个点时被阻塞，直到最后一个线程也到达，然后所有线程再一起继续执行。并且它可以被重用（循环）。`CountDownLatch`是一次性的，只能倒数一次。"
  },
  {
    "id": 85,
    "type": "code",
    "question": "请用SQL语句查询`students`表中`age`字段第二大的学生信息。",
    "answer": "SELECT * FROM students ORDER BY age DESC LIMIT 1 OFFSET 1;  (或者使用子查询：SELECT * FROM students WHERE age = (SELECT DISTINCT age FROM students ORDER BY age DESC LIMIT 1 OFFSET 1);)",
    "score": 3,
    "explanation": "考察SQL编程能力，分页查询（LIMIT, OFFSET）和子查询是常见技巧。"
  },
  {
    "id": 86,
    "type": "single",
    "question": "Java虚拟机规范中，定义了哪种内存溢出错误，当堆中没有足够内存分配给新对象且堆也无法再扩展时？",
    "options": ["StackOverflowError", "OutOfMemoryError: Java heap space", "OutOfMemoryError: Metaspace", "OutOfMemoryError: PermGen space"],
    "answer": "OutOfMemoryError: Java heap space",
    "score": 2,
    "explanation": "这是最常见的内存溢出错误，明确指出问题发生在Java堆内存区域。"
  },
  {
    "id": 87,
    "type": "short_answer",
    "question": "为什么现代框架（如Spring）倾向于使用构造器注入（Constructor Injection）而不是字段注入（Field Injection）？",
    "answer": "主要原因有：1. 保证依赖不可变：构造器注入可以使依赖字段成为`final`的。2. 保证对象在使用前是完整状态的：依赖在对象创建时就已经备好。3. 避免循环依赖：Spring容器在启动时就能检测到构造器循环依赖并报错。4. 更有利于单元测试：可以方便地手动创建对象并传入mock的依赖。",
    "score": 4,
    "explanation": "考察对DI方式优劣的理解，体现了对编写健壮、可测试代码的追求。"
  },
  {
    "id": 88,
    "type": "single",
    "question": "哪一个设计模式允许一个对象在内部状态改变时改变它的行为，看起来好像修改了它的类？",
    "options": ["策略模式（Strategy）", "状态模式（State）", "观察者模式（Observer）", "装饰者模式（Decorator）"],
    "answer": "状态模式（State）",
    "score": 4,
    "explanation": "状态模式的核心思想就是将对象的每种状态封装成独立的类，并将所有与状态相关的行为都委托给当前状态对象，从而使得对象的行为可以随着状态的改变而改变。"
  },
  {
    "id": 89,
    "type": "true_false",
    "question": "MyBatis中，`#`和`$`的区别是，`#`会进行预编译处理，可以防止SQL注入，而`$`是简单的字符串替换。",
    "answer": "true",
    "score": 2.5,
    "explanation": "这是MyBatis中一个非常重要的知识点。应优先使用`#{}`来处理用户输入等参数，只有在需要动态替换表名、列名等非参数部分时才谨慎使用`${}`。"
  },
  {
    "id": 90,
    "type": "code",
    "question": "请写出冒泡排序的Java实现。",
    "answer": "public void bubbleSort(int[] arr) { int n = arr.length; for (int i = 0; i < n - 1; i++) { for (int j = 0; j < n - 1 - i; j++) { if (arr[j] > arr[j + 1]) { int temp = arr[j]; arr[j] = arr[j + 1]; arr[j + 1] = temp; } } } }",
    "score": 2,
    "explanation": "考察基本的算法和编程功底，虽然实际开发中不常用，但是面试中常作为考察候选人基础编码能力的题目。"
  },
  {
    "id": 91,
    "type": "single",
    "question": "在Java中，多态性的实现不依赖于以下哪个机制？",
    "options": [
        "继承",
        "方法重写（Override）",
        "父类引用指向子类对象",
        "方法重载（Overload）"
    ],
    "answer": "方法重载（Overload）",
    "score": 2.5,
    "explanation": "多态性（Polymorphism）是运行时行为，依赖于继承、方法重写和向上转型。而方法重载是编译时行为，编译器在编译阶段就已经根据参数列表确定了要调用哪个具体方法，不属于运行时多态。"
  },
  {
    "id": 92,
    "type": "short_answer",
    "question": "什么是CAS（Compare-And-Swap）？它可能导致什么问题？",
    "answer": "CAS是一种无锁化的乐观锁技术，它包含三个操作数：内存位置V、预期原值A和新值B。当且仅当V的值等于A时，才用B更新V的值，否则不做任何操作。这个过程是原子性的。它可能导致ABA问题，即一个值从A变为B又变回了A，CAS会误认为它没有变过。可以通过版本号（如`AtomicStampedReference`）来解决。",
    "score": 4,
    "explanation": "这是理解Java并发包中许多原子类和无锁数据结构底层原理的关键。"
  },
  {
    "id": 93,
    "type": "single",
    "question": "Java 9 引入的模块化系统（Project Jigsaw）解决的核心问题不包括？",
    "options": [
        "解决classpath地狱问题",
        "加强封装性，隐藏内部实现",
        "提升应用性能和安全性",
        "实现热部署功能"
    ],
    "answer": "实现热部署功能",
    "score": 3,
    "explanation": "模块化主要为了解决类路径混乱、加强封装（明确模块间依赖和暴露的API）、以及通过只打包必要模块来减小应用体积和提升安全性。热部署功能不是其直接目标。"
  },
  {
    "id": 94,
    "type": "short_answer",
    "question": "什么是幂等性（Idempotence）？在系统设计中为什么它很重要？",
    "answer": "幂等性指对同一个接口的多次调用（大于等于一次），其产生的影响和一次调用的影响是相同的。在分布式系统和网络不稳定的情况下，客户端可能会重试请求，如果接口不具备幂等性（如创建订单接口），多次调用就会导致重复创建订单等问题。保证接口幂等性是构建可靠系统的关键。",
    "score": 4,
    "explanation": "这是后端系统设计中非常重要的一个概念，尤其是在设计API和处理支付、订单等关键业务时。"
  },
  {
    "id": 95,
    "type": "code",
    "question": "请使用Git命令，将当前分支的最近两次提交合并成一个提交。",
    "answer": "使用交互式变基（interactive rebase）。命令是 `git rebase -i HEAD~2`。然后在弹出的编辑器中，将第二行的`pick`改为`s`或`squash`，保存并退出，最后编辑新的提交信息。",
    "score": 3.5,
    "explanation": "考察对Git高级命令的掌握，这是保持提交历史干净、有条理的重要技巧。"
  },
  {
    "id": 96,
    "type": "single",
    "question": "在JVM的GC中，CMS（Concurrent Mark Sweep）收集器主要用于哪个内存区域？它的主要缺点是什么？",
    "options": [
        "新生代，会产生内存碎片",
        "老年代，会产生内存碎片",
        "新生代，会暂停所有用户线程",
        "老年代，会暂停所有用户线程"
    ],
    "answer": "老年代，会产生内存碎片",
    "score": 4,
    "explanation": "CMS是一款以获取最短回收停顿时间为目标的老年代收集器。它基于“标记-清除”算法，因此它的主要缺点是会产生大量内存碎片，可能导致后续无法为大对象分配空间而提前触发Full GC。"
  },
  {
    "id": 97,
    "type": "short_answer",
    "question": "谈谈你对CAP理论的理解。",
    "answer": "CAP理论是分布式系统设计的核心理论，指出一个分布式系统不可能同时满足以下三点：一致性（Consistency）、可用性（Availability）和分区容错性（Partition tolerance）。由于网络分区是必然存在的，因此设计师必须在C和A之间做出权衡。选择CP意味着保证数据一致性，可能会牺牲部分可用性（如主节点故障时）；选择AP意味着保证服务高可用，可能会牺牲数据的强一致性（允许短暂的数据不一致）。",
    "score": 4,
    "explanation": "考察对分布式系统理论的理解，是成为高级工程师的必经之路。"
  },
  {
    "id": 98,
    "type": "single",
    "question": "Spring Boot Actuator模块主要提供了什么功能？",
    "options": [
        "数据库访问",
        "Web服务开发",
        "应用监控和管理",
        "安全认证和授权"
    ],
    "answer": "应用监控和管理",
    "score": 2,
    "explanation": "Actuator提供了许多生产级别的特性，通过HTTP端点（如`/health`, `/metrics`, `/beans`）来监控和管理正在运行的Spring Boot应用。"
  },
  {
    "id": 100,
    "type": "code",
    "question": "在`pom.xml`中，如何排除一个依赖所传递过来的某个特定依赖？请写出示例代码片段。",
    "answer": "使用`<exclusions>`标签。例如，要从`spring-boot-starter-web`中排除掉默认的`tomcat`依赖：\n```xml\n<dependency>\n    <groupId>org.springframework.boot</groupId>\n    <artifactId>spring-boot-starter-web</artifactId>\n    <exclusions>\n        <exclusion>\n            <groupId>org.springframework.boot</groupId>\n            <artifactId>spring-boot-starter-tomcat</artifactId>\n        </exclusion>\n    </exclusions>\n</dependency>\n```",
    "score": 3,
    "explanation": "这是解决Maven传递性依赖冲突的常用且有效的方法，是工程实践中的必备技能。"
  }
];
