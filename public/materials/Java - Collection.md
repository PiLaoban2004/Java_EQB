---
epoch: 1755089244825
modelKey: gemini-2.5-pro|google


tags:
  - copilot-conversation
---

## 集合 (Collections Framework)

### 1. 集合的底层思想与价值

#### 1.1 为什么需要集合？

在编程中，我们经常需要处理一组数量不确定的、具有某种关联性的数据。

- **问题域**: 当我们需要容纳一组数据，但其具体数量在编译时无法确定，在运行时可能动态变化时，传统的固定长度数组（Array）就显得力不从心。
- **解决方案**: Java集合框架（Java Collections Framework, JCF）提供了一套性能优良、使用方便的接口和类，专门用于处理不定长的数据集合，它构成了一个完整的数据容器体系。

#### 1.2 集合与数组的核心区别

| 特性 | 数组 (Array) | 集合 (Collection) |
| :--- | :--- | :--- |
| **长度** | **固定**。一旦创建，其长度不可改变。 | **可变**。可以动态地添加或删除元素，自动扩容或缩容。 |
| **元素类型** | 可存储基本数据类型和引用数据类型。 | 只能存储**引用数据类型**（对象）。若要存储基本类型，需使用其对应的包装类（如`Integer`, `Double`）。 |
| **功能** | 功能相对单一，主要提供索引访问，缺少高级操作的现成方法。 | 提供了大量优化过的方法用于增、删、改、查、遍历、排序等，功能强大。 |
| **底层** | 是一块连续的内存空间。 | 底层数据结构多样，如数组、链表、哈希表、红黑树等，以支持不同场景下的性能需求。 |

> [!tip] 核心思想
> 当您需要对一组**数量不确定**且**有关联**的数据进行统一的逻辑处理时，使用集合是最佳实践。

### 2. Java集合框架（JCF）的顶层设计

Java的集合框架在设计上高度抽象，主要分为两大顶层接口，代表了两种核心的数据组织方式：

1.  **`Collection` 接口**:
    > [!info] 定义
    > 代表一组**独立**的、**单个**的元素序列。它是处理单值数据的最高抽象。
    - **核心子接口**:
        - **`List` (列表)**
            - **特点**: 元素**有序**（按插入顺序存储），且**可重复**。
            - **底层思想**: 强调通过索引精确控制元素，类似于一个动态的数组。
            - **主要实现类**: `ArrayList`, `LinkedList`。
        - **`Set` (集)**
            - **特点**: 元素**无序**（通常不保证插入顺序），且**不可重复**。
            - **底层思想**: 类似于数学中的“集合”概念，保证元素的唯一性。
            - **主要实现类**: `HashSet`, `TreeSet`。
        - **`Queue` (队列)**
            - **特点**: 遵循**先进先出 (FIFO)** 原则的有序列表。
            - **底层思想**: 模拟现实生活中的排队场景，常用于任务调度等。
            - **主要实现类**: `ArrayDeque`, `LinkedList`。

2.  **`Map` 接口**:
    > [!info] 定义
    > 代表一组**键值对（Key-Value Pair）**的集合。每个键（Key）都是唯一的，并映射到一个值（Value）。
    - **底层思想**: 通过唯一的“键”来快速定位和检索对应的“值”，提供了比索引更灵活的数据关联方式。
    - **主要实现类**: `HashMap`, `Hashtable`, `TreeMap`。

---

### 3. `List` 接口详解

`List` 接口是 `Collection` 的核心子接口之一，它代表一个有序的集合，用户可以通过索引（在列表中的位置）来访问元素。

#### 3.1 `ArrayList` — 底层是动态数组的列表

`ArrayList` 是 `List` 接口最常用的实现类。

- **底层数据结构**: **动态数组 (`Object[]`)**。

> [!tip] ArrayList 核心思想
> - **查询高效**: 由于其底层是数组，通过索引（index）进行随机访问（`get(index)`）的时间复杂度为 **O(1)**，速度极快。
> - **增删相对低效**:
>   - **尾部添加 (`add(e)`)**: 摊销时间复杂度为 **O(1)**。但在数组容量不足时，会触发**扩容**机制，带来一次性的性能开销。
>   - **中间或头部增删**: 时间复杂度为 **O(n)**，因为这需要移动该位置之后的所有元素。

#### 3.2 `LinkedList` — 底层是双向链表的列表

`LinkedList` 是 `List` 接口的另一个重要实现类，同时它也实现了 `Deque` (双端队列) 接口。

- **底层数据结构**: **双向链表 (Doubly-Linked List)**。

> [!tip] LinkedList 核心思想
> - `LinkedList` 中的每个元素都是一个**节点 (Node)**，包含数据和前后节点的引用。
> - **增删高效**: 尤其是在列表的**头部和尾部**进行操作，时间复杂度为 **O(1)**。因为只需要改变前后节点的引用指针，无需移动元素。
> - **查询低效**: 随机访问 (`get(index)`) 的时间复杂度为 **O(n)**，因为它需要从头或尾开始遍历链表。

---

### 4. `ArrayList` vs. `LinkedList` — 选型总结

| 对比维度 | `ArrayList` | `LinkedList` |
| :--- | :--- | :--- |
| **底层结构** | 动态数组 | 双向链表 |
| **随机访问 (Get)** | **快 (O(1))** | **慢 (O(n))** |
| **插入/删除** | **慢 (O(n))**，涉及元素移动 | **快 (O(1))**，只修改指针 |
| **内存开销** | 较小 | 较大（需额外存储指针） |
| **适用场景** | **读多写少**，或只在列表**末尾**增删。 | **写多读少**，或需频繁在**列表头尾**增删。 |

> [!check] 选型核心依据
> 应根据业务场景中“查询”和“增删”操作的频率来决定使用哪种 `List` 实现，以达到最优的性能。

---

### 5. 泛型 (Generics) — 类型安全的基石

#### 5.1 为什么引入泛型？

在泛型出现之前（JDK 1.5以前），Java集合存储的是 `Object`，这带来了两个问题：
1.  **类型不安全**: 任何类型的对象都能存入，编译时无法检查，运行时可能抛出 `ClassCastException`。
2.  **代码繁琐**: 取出元素时必须手动进行强制类型转换。

> [!info] 泛型的核心思想
> 将**类型检查**从**运行时**提前到**编译时**。它允许我们定义类、接口和方法时使用**类型参数**，在创建实例时再指定具体的类型。

#### 5.2 泛型的本质与特性

- **类型参数化**：泛型是一个类型占位符，代表“某种类型”。
- **编译期机制**：泛型信息在编译后会被**擦除 (Type Erasure)**，字节码中不包含泛型信息。它是给编译器看的。
- **泛型不具有多态性**：如果 `Dog` 是 `Animal` 的子类，`List<Dog>` **不是** `List<Animal>` 的子类型。

---

### 6. `Set` 接口详解

`Set` 接口代表一个**不包含重复元素**的集合，其核心价值在于保证元素的**唯一性**。

#### 6.1 `HashSet` — 基于哈希表的无序集合

- **底层数据结构**: **`HashMap`**。`HashSet` 的元素作为 `HashMap` 的 `key` 存储。
- **核心特点**:
    - **唯一性**: 不允许重复元素。
    - **无序性**: 不保证元素的存取顺序。
    - **允许null**: 最多可以存储一个 `null` 元素。

#### 6.2 `HashSet` 唯一性的底层原理

> [!question] HashSet 如何保证元素唯一?
> `HashSet` 依赖对象的 `hashCode()` 和 `equals(Object obj)` 这两个方法来判断重复。对于自定义对象，**必须同时重写这两个方法**。
> 
> **`add(element)` 的工作流程:**
> 1.  计算 `element` 的 `hashCode()` 值，定位到其在哈希表中的存储位置（桶）。
> 2.  **如果该桶为空**，直接存入，添加成功。
> 3.  **如果该桶不为空（哈希冲突）**，则遍历桶中的所有已有元素：
>     - 依次调用 `element.equals(existingElement)` 进行比较。
>     - **如果 `equals()` 返回 `true`**，说明元素已存在，添加失败。
>     - **如果遍历完所有元素 `equals()` 均返回 `false`**，则将新元素添加到桶中，添加成功。

> [!warning] 重要约定
> 如果两个对象通过 `equals()` 方法判断为相等，那么它们的 `hashCode()` 方法**必须**返回相同的值。

```java
// 示例：重写hashCode()和equals()以保证对象唯一性
class User8 {
    public int id;
    public String name;
    
    public User8(int id, String name) {
        this.id = id;
        this.name = name;
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(id, name); // 推荐使用Objects.hash()
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        User8 other = (User8) obj;
        return this.id == other.id && java.util.Objects.equals(this.name, other.name);
    }
}

// 测试
HashSet<User8> set = new HashSet<>();
set.add(new User8(1001, "zhangsan"));
set.add(new User8(1001, "zhangsan")); // 添加失败
System.out.println(set.size()); // 输出 1
```

---

### 7. `Map` 接口详解

`Map` 接口用于存储**键值对 (key-value pair)**。Map中的`key`是唯一的，每个`key`都映射到一个`value`。

#### 7.1 `HashMap` 与 `Hashtable` 的对比

| 特性 | `HashMap` | `Hashtable` |
| :--- | :--- | :--- |
| **线程安全** | **非线程安全**，性能较高。 | **线程安全** (方法同步)，性能较低。 |
| **Null值** | **允许** `key` 和 `value` 为 `null`。 | **不允许** `key` 和 `value` 为 `null`。 |
| **推荐使用** | **是** (现代Java首选)。 | **否** (已被`ConcurrentHashMap`取代)。 |

> [!tip] 结论
> 在新代码中，**总是推荐使用 `HashMap`**。如果需要线程安全，应使用 `java.util.concurrent.ConcurrentHashMap`。

#### 7.2 遍历 `Map` 的三种方式

> [!check] 推荐使用 `entrySet()`
> 这是最高效的遍历方式，因为它一次性提供了`key`和`value`，避免了通过key再次查找value的开销。

1.  **遍历 `keySet()`**: 先获取所有`key`的`Set`，再通过`map.get(key)`获取`value`。
    ```java
    for (String key : map.keySet()) {
        System.out.println(key + " => " + map.get(key));
    }
    ```
2.  **遍历 `values()`**: 当只关心`value`时使用。
    ```java
    for (String value : map.values()) {
        System.out.println(value);
    }
    ```
3.  **遍历 `entrySet()`（推荐）**:
    ```java
    for (Map.Entry<String, String> entry : map.entrySet()) {
        System.out.println(entry.getKey() + " => " + entry.getValue());
    }
    ```

---

### 8. 迭代器 (Iterator) 与并发修改异常

#### 8.1 `Iterator` 接口
`Iterator` 是遍历集合的统一标准接口，它提供了安全地遍历和删除元素的方式。
- `boolean hasNext()`: 判断是否还有下一个元素。
- `E next()`: 返回下一个元素，并将指针后移。
- `void remove()`: **安全地**删除由`next()`方法返回的最后一个元素。
- [[迭代器的使用]]

#### 8.2 `ConcurrentModificationException`

> [!warning] 核心规则
> 当使用**迭代器**（包括增强for循环）遍历一个集合时，绝对不能通过**集合自身的方法**（如 `list.remove()`, `map.put()`) 来修改集合的结构（添加、删除元素）。

这样做会破坏迭代器内部的状态，导致 `ConcurrentModificationException` (并发修改异常)。

**错误示例**:
```java
// 这段代码会抛出 ConcurrentModificationException
for (String key : map.keySet()) {
    if ("b".equals(key)) {
        map.remove("b"); // 错误！在for-each循环中用map的方法修改集合
    }
}
```

**正确做法：使用迭代器的`remove()`方法**
```java
Iterator<String> iterator = map.keySet().iterator();
while (iterator.hasNext()) {
    String key = iterator.next();
    if ("b".equals(key)) {
        // 正确！使用迭代器自己的remove方法删除当前元素
        iterator.remove();
    }
}
```

> [!tip] 底层思想
> 集合内部有一个 `modCount` 变量记录修改次数。迭代器初始化时会记录这个值。在迭代过程中，如果集合的`modCount`被改变（通过集合自身方法修改），而迭代器不知道，下一次`next()`调用时就会发现两个值不一致，从而抛出异常。迭代器自己的`remove()`方法在删除元素时会同步更新这个计数值，因此是安全的。
[Timestamp: 2025/08/13 21:28:07]

### 9. 集合工具与排序

#### 9.1 `Arrays` 工具类

`java.util.Arrays` 类提供了大量用于操作数组的静态方法。

- `toString(array)`: 将数组转换为易于阅读的字符串 `"[e1, e2, e3]"`。
- `sort(array)`: 对数组进行排序（默认升序）。
- `binarySearch(array, key)`: 在**已排序**的数组中进行二分查找。
- `equals(array1, array2)`: 比较两个数组的内容是否完全相同。

#### 9.2 集合排序与 `Comparator`

对于 `List` 集合，可以通过 `list.sort()` 方法进行排序，该方法需要一个 `Comparator` (比较器) 对象作为参数来定义排序规则。

- **`Comparator<T>` 接口**:
    
    - 核心方法: `int compare(T o1, T o2)`
    - **返回值约定**:
        - **返回负数**: 表示 `o1` 应该排在 `o2` **前面**。
        - **返回正数**: 表示 `o1` 应该排在 `o2` **后面**。
        - **返回零**: 表示 `o1` 和 `o2` 相等。
- **示例：实现降序排序**
    
    ```java
    class NumberComparator implements Comparator<Integer> {
    
        @Override
    
        public int compare(Integer o1, Integer o2) {
    
            // o2 - o1 > 0  => o2 > o1 => o2排前面 (降序)
    
            // o2 - o1 < 0  => o2 < o1 => o1排前面 (降序)
    
            return o2 - o1;
    
        }
    
    }
    
    ArrayList<Integer> list = new ArrayList<>(List.of(1, 3, 2));
    
    list.sort(new NumberComparator()); // 使用自定义比较器排序
    
    System.out.println(list); // 输出: [3, 2, 1]
```
### 10. Java I/O (Input/Output)

#### 10.1 I/O 的核心思想与模型

在计算机科学中，任何程序都需要与外部世界交换数据，这种交换就是输入/输出（I/O）。Java 将这种复杂的数据交换过程抽象为一种统一的模型——**流 (Stream)**。

- **I (Input) / 输入**: 程序从外部数据源（如文件、网络、键盘）**读取**数据的过程。
- **O (Output) / 输出**: 程序将处理后的数据**写入**到外部目标（如文件、网络、显示器）的过程。
- **Stream / 流**: 一种抽象的数据通道。数据被视为一连串有序的字节或字符，像水流一样从一端（源）流向另一端（目的地）。

> [!info] I/O 的本质
> Java I/O 的本质是程序通过一个名为“流”的管道对象，与外部设备进行有序的数据交换。

---

#### 10.2 `File` 类 — 文件系统的入口

`java.io.File` 类是文件和目录路径的抽象表示，它是 Java 程序操作文件系统的起点。

> [!warning] `File` 类 ≠ 文件内容
> 一个 `File` 对象**仅代表一个路径**（指向一个文件或文件夹），它本身并不包含文件的实际数据。要读写文件内容，必须使用 I/O 流。

##### `File` 类的核心 API

| 分类 | 方法签名 | 描述 |
| :--- | :--- | :--- |
| **创建/删除** | `boolean createNewFile()` | 当文件不存在时，创建一个新的空文件。 |
| | `boolean mkdirs()` | 创建此路径对应的目录，包括所有不存在的父目录。 |
| | `boolean delete()` | 删除此路径表示的文件或**空**目录。 |
| **判断** | `boolean exists()` | 判断路径表示的文件或目录是否存在。 |
| | `boolean isFile()` | 判断路径是否为标准文件。 |
| | `boolean isDirectory()` | 判断路径是否为目录。 |
| **获取信息** | `String getName()` | 返回文件名或目录名。 |
| | `String getAbsolutePath()` | 返回绝对路径字符串。 |
| | `long length()` | 返回文件的大小（字节数）。对目录使用时返回值不确定。 |
| | `File[] listFiles()` | 返回目录中所有内容的 `File` 对象数组。 |

---

#### 10.3 I/O 流的分类体系

Java 的 I/O 流体系庞大但结构清晰，可以从两个维度进行划分：

1.  **按处理的数据单元**:
    - **字节流 (Byte Stream)**: 以**字节 (byte)**为单位处理数据。它是万能的，可以处理任何类型的数据（文本、图片、音视频等）。
        - 顶级抽象类: `InputStream` 和 `OutputStream`。
    - **字符流 (Character Stream)**: 以**字符 (char)**为单位处理数据。它专为处理**纯文本**数据而设计，能自动处理字符编码，有效防止乱码。
        - 顶级抽象类: `Reader` 和 `Writer`。

2.  **按流向**:
    - **输入流 (Input/Reader)**: 从数据源**读取**数据到程序。
    - **输出流 (Output/Writer)**: 从程序**写入**数据到目标。

---

#### 10.4 字节流 — 处理一切数据

由于计算机底层所有数据都以字节形式存在，因此字节流是 I/O 操作的基础。

##### 10.4.1 基础文件复制：单字节读写

这是最基础的文件操作方式，通过 `FileInputStream` 和 `FileOutputStream` 实现。

- **`read()`**: 从输入流读取下一个字节。如果到达流末尾，返回 `-1`。
- **`write(int b)`**: 将指定字节写入输出流。

```java
// 传统 try-catch-finally 写法，确保资源关闭
FileInputStream in = null;
FileOutputStream out = null;
try {
    in = new FileInputStream("source.jpg");
    out = new FileOutputStream("destination.jpg");
    int byteData;
    // 循环读取：当 read() 返回 -1 时，表示文件已读完
    while ((byteData = in.read()) != -1) {
        out.write(byteData);
    }
} catch (IOException e) {
    e.printStackTrace();
} finally {
    // 必须在 finally 块中分别关闭流，以确保资源释放
    try {
        if (in != null) in.close();
    } catch (IOException e) {
        e.printStackTrace();
    }
    try {
        if (out != null) out.close();
    } catch (IOException e) {
        e.printStackTrace();
    }
}
```

> [!warning] 性能瓶颈
> 单字节读写频繁地与硬盘进行I/O交互，效率极低。每读/写一个字节都可能触发一次系统调用，开销巨大，不推荐在实际项目中使用。
##### 10.4.2 使用缓冲区提升性能

为了解决性能问题，我们引入**缓冲区 (Buffer)**。一次性从文件中读取一块数据到内存中的字节数组，处理完后再写入。

**方式一：手动创建字节数组作为缓冲区**

```java
// ... try-catch-finally 结构同上 ...
byte[] buffer = new byte[1024]; // 创建一个1KB的缓冲区
int len; // 记录每次实际读取的字节数
// read(buffer) 返回实际读取的字节数，末尾返回 -1
while ((len = in.read(buffer)) != -1) {
    // 每次写入 len 个字节，防止最后一次写入多余数据
    out.write(buffer, 0, len);
}
```

**方式二：使用缓冲流（推荐）**

Java 提供了专门的缓冲流 `BufferedInputStream` 和 `BufferedOutputStream`。它们内部封装了缓冲区和读写逻辑，是典型的**装饰器模式**应用，能极大地简化代码并提升性能。

> [!tip] `try-with-resources` 语法
> 从 JDK 7 开始，推荐使用 `try-with-resources` 语句来自动管理资源。它能确保在 `try` 块执行完毕后，无论是否发生异常，流都会被自动关闭，代码更简洁、安全。

```java
// 使用 try-with-resources 语法，自动关闭资源
try (
    BufferedInputStream bis = new BufferedInputStream(new FileInputStream("source.mp4"));
    BufferedOutputStream bos = new BufferedOutputStream(new FileOutputStream("dest.mp4"))
) {
    byte[] buffer = new byte[8192]; // 8KB 缓冲区是常见选择
    int len;
    while ((len = bis.read(buffer)) != -1) {
        bos.write(buffer, 0, len);
    }
} catch (IOException e) {
    e.printStackTrace();
}
```

---

#### 10.5 字符流 — 专为处理纯文本

当处理纯文本文件时，使用字符流是最佳实践，因为它可以正确处理不同的**字符编码**（如 UTF-8, GBK），避免乱码问题。

- **节点流**: `FileReader` / `FileWriter`
- **缓冲处理流**: `BufferedReader` / `BufferedWriter`
- **便捷打印流**: `PrintWriter`

```java
// 使用 BufferedReader 和 PrintWriter 逐行复制文本文件
try (
    BufferedReader reader = new BufferedReader(new FileReader("source.txt"));
    PrintWriter writer = new PrintWriter("destination.txt")
) {
    String line;
    // readLine() 方法可以一次读取一行文本，读到末尾时返回 null
    while ((line = reader.readLine()) != null) {
        writer.println(line); // println 会自动写入换行符
    }
} catch (IOException e) {
    e.printStackTrace();
}
```

> [!check] 字节流 vs. 字符流
> - **通用性**: 字节流可处理任何类型的文件。
> - **专业性**: 字符流专为处理文本文件而生，能有效避免乱码。
> - **选型**: **处理纯文本用字符流，处理其他所有二进制文件（图片、视频、音频等）用字节流。**

---

#### 10.6 对象流 — 序列化与反序列化

Java 允许将内存中的对象状态转换为字节序列，以便存储到文件或通过网络传输，这个过程称为**对象序列化**。反之，从字节序列中恢复对象的过程称为**反序列化**。

- **`ObjectOutputStream`**: 对象输出流，使用 `writeObject(Object obj)` 方法进行序列化。
- **`ObjectInputStream`**: 对象输入流，使用 `readObject()` 方法进行反序列化。

> [!check] `Serializable` 接口
> 一个类的对象要想被序列化，该类**必须**实现 `java.io.Serializable` 标记接口。此接口没有任何方法，仅作为 JVM 的一个标记，表示该类对象是“可序列化的”。

```java
// User 类必须实现 Serializable 接口
class User implements java.io.Serializable {
    private String name;
    private int age;
    // 构造器、getter/setter、toString...
}

// 序列化：将 User 对象写入文件
try (ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream("user.dat"))) {
    User user = new User("Alice", 25);
    oos.writeObject(user);
} catch (IOException e) {
    e.printStackTrace();
}

// 反序列化：从文件中读取数据并恢复为 User 对象
try (ObjectInputStream ois = new ObjectInputStream(new FileInputStream("user.dat"))) {
    User user = (User) ois.readObject();
    System.out.println(user);
} catch (IOException | ClassNotFoundException e) {
    e.printStackTrace();
}
```

---

#### 10.7 常见 I/O 异常

- `IOException`: 所有 I/O 异常的基类，是一个受检异常。
- `FileNotFoundException`: 试图打开一个不存在的文件时抛出。
- `NotSerializableException`: 试图序列化一个未实现 `Serializable` 接口的对象时抛出。
- `ClassNotFoundException`: 反序列化时，若 JVM 在当前 classpath 中找不到对应的 `.class` 文件，则抛出此异常。
