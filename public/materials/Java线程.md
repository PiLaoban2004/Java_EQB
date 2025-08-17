
## 1. Java 并发编程 (Concurrency)

### 1.1 线程与进程的基础

在现代操作系统中，程序执行的单位被划分为进程和线程，理解它们的区别是并发编程的基石。

- **进程 (Process)**:
    - 是操作系统进行**资源分配和调度**的基本单位。
    - 可以理解为一个**独立运行的应用程序实例**（例如，启动一个Word文档，就开启了一个Word进程）。
    - 每个进程都拥有自己独立的内存空间，进程间的资源是隔离的。
- **线程 (Thread)**:
    - 是进程的**一个执行单元**，是CPU调度和分派的基本单位，也被称为轻量级进程。
    - 一个进程至少包含一个线程（主线程），也可以包含多个线程。
    - 同一进程内的所有线程**共享该进程的内存空间和资源**（如堆内存、全局变量），但每个线程拥有自己独立的栈空间。

> [!info] 核心类比
> - **进程**就像一个**工厂**，拥有独立的厂房、设备和资源。
> - **线程**就像工厂里的**工人**，多个工人在同一个工厂内协同工作，共享工厂的资源来完成生产任务。

> [!tip] 为什么需要多线程？
> 多线程的核心价值在于**提高CPU的利用率**。当一个线程因为I/O操作（如读写文件、网络请求）而阻塞时，CPU可以切换到其他可运行的线程继续执行任务，从而避免了CPU的空闲等待，提升了程序的整体执行效率。

#### 1.1.1 主线程 (Main Thread)

- 任何Java程序启动时，JVM都会创建一个进程，并在这个进程中启动一个名为 `main` 的主线程。
- `main` 方法就是这个主线程的入口点，我们编写的代码默认都在主线程中执行。

```java
public class MainThreadDemo {
    public static void main(String[] args) {
        // Thread.currentThread() 获取当前正在执行的线程对象
        // getName() 获取线程的名称
        Thread currentThread = Thread.currentThread();
        System.out.println("当前线程是: " + currentThread.getName()); // 输出: 当前线程是: main
    }
}
```

---

### 1.2 创建线程的两种核心方式

在Java中，创建新线程主要有两种方式：继承 `Thread` 类和实现 `Runnable` 接口。

#### 1.2.1 方式一：继承 `Thread` 类

1.  创建一个类，继承自 `java.lang.Thread`。
2.  重写 `run()` 方法，将线程需要执行的业务逻辑放在此方法中。
3.  创建该子类的实例，并调用其 `start()` 方法来启动线程。

```java
// 1. 声明自定义线程类
class MyThread extends Thread {
    // 2. 重写 run 方法，定义线程任务
    @Override
    public void run() {
        System.out.println("MyThread 正在执行，线程名: " + Thread.currentThread().getName());
    }
}

public class TestThread {
    public static void main(String[] args) {
        // 3. 创建实例并启动
        MyThread t1 = new MyThread();
        t1.start(); // 调用 start() 而不是 run()！
    }
}
```

#### 1.2.2 方式二：实现 `Runnable` 接口

1.  创建一个类，实现 `java.lang.Runnable` 接口。
2.  实现接口中的 `run()` 方法。
3.  创建该实现类的实例，并将其作为参数传递给 `new Thread()` 的构造器来创建线程对象。
4.  调用 `Thread` 对象的 `start()` 方法。

```java
// 1. 声明任务类，实现 Runnable 接口
class MyTask implements Runnable {
    // 2. 实现 run 方法
    @Override
    public void run() {
        System.out.println("MyTask 正在执行，线程名: " + Thread.currentThread().getName());
    }
}

public class TestRunnable {
    public static void main(String[] args) {
        // 3. 创建任务对象
        MyTask myTask = new MyTask();
        // 4. 将任务对象传递给 Thread 对象并启动
        Thread t2 = new Thread(myTask);
        t2.start();

        // 现代写法：使用 Lambda 表达式简化
        Thread t3 = new Thread(() -> {
            System.out.println("Lambda 任务正在执行，线程名: " + Thread.currentThread().getName());
        });
        t3.start();
    }
}
```

#### 1.2.3 两种方式的对比与选择

|对比维度|继承 `Thread` 类|实现 `Runnable` 接口|
|---|---|---|
|**耦合性**|**高**。任务逻辑与线程强耦合。|**低**。任务(Runnable)与线程(Thread)分离，符合单一职责原则。|
|**继承限制**|**受限**。Java是单继承，继承了`Thread`就不能再继承其他类。|**灵活**。可以继承其他类，同时实现多个接口。|
|**资源共享**|**不便**。若多个线程执行相同代码，需创建多个线程对象，不易共享实例变量。|**方便**。可以创建同一个`Runnable`实例，并传递给多个`Thread`对象，轻松实现资源共享。|

> [!check] 推荐使用：实现 `Runnable` 接口
> **实现 `Runnable` 接口是更推荐的方式**。它将“任务”和“执行任务的线程”解耦，结构更清晰，扩展性更好，也更适合资源共享的场景。

---

### 1.3 线程的生命周期

线程从创建到消亡会经历一系列的状态，理解这些状态是进行线程调试和控制的关键。

1.  **新建 (NEW)**
    - 当一个 `Thread` 对象被创建但还未调用 `start()` 方法时，它处于新建状态。
2.  **可运行 (RUNNABLE)**
    - 调用 `start()` 方法后，线程进入可运行状态。此时，线程位于**可运行线程池**中，等待操作系统的CPU调度。它可能正在运行，也可能在等待CPU时间片。
3.  **阻塞 (BLOCKED)**
    - 线程等待进入一个 `synchronized` 同步代码块或方法，但该锁被其他线程持有时，进入阻塞状态。
4.  **等待 (WAITING)**
    - 线程执行了 `Object.wait()`、`Thread.join()` 或 `LockSupport.park()` 等方法后，进入无限期等待状态，需要被其他线程显式地唤醒（通过`notify()`, `notifyAll()`等）。
5.  **计时等待 (TIMED_WAITING)**
    - 与等待状态类似，但有时间限制。执行 `Thread.sleep(long)`、`Object.wait(long)`、`Thread.join(long)`等方法后进入此状态。时间结束后或被唤醒后，会重新回到可运行状态。
6.  **终止 (TERMINATED)**
    - `run()` 方法执行完毕或因异常退出后，线程进入终止状态，生命周期结束。

---

### 1.4 线程的执行与控制

#### 1.4.1 并发与串行

- **并发执行**:
    - 多个线程独立运行，由操作系统调度，谁抢到CPU的执行权谁就执行。这是多线程的默认行为，执行顺序具有不确定性。
- **串行执行**:
    - 通过特定方法，让多个线程按指定的顺序依次执行。可以使用 `thread.join()` 方法实现。

> **`thread.join()`**
> - **作用**：让**当前线程**进入等待状态，直到**`thread`这个目标线程**执行完毕。
> - **示例**：在 `main` 线程中调用 `t1.join()`，意味着 `main` 线程会暂停，直到 `t1` 线程完全结束，`main` 线程才会继续执行。

```java
t1.start();
t2.start();

// main线程等待 t1 线程执行完毕
t1.join();

// main线程等待 t2 线程执行完毕
t2.join();

System.out.println("main线程在 t1 和 t2都结束后才执行");
```

#### 1.4.2 线程休眠：`Thread.sleep()`

- **作用**: 让**当前正在执行的线程**暂停指定的时间（毫秒），进入**计时等待 (TIMED_WAITING)** 状态。
- **特性**:
    - 是 `Thread` 类的**静态方法**。
    - 休眠期间，线程**不会释放它所持有的任何锁**。
    - 会抛出 `InterruptedException` 受检异常，需要处理。

---

### 1.5 线程安全问题

> [!warning] 什么是线程安全问题？
> 当多个线程并发地**读写同一个共享资源**（如成员变量、静态变量），并且至少有一个线程在进行**写操作**时，由于CPU调度的不确定性，可能会导致数据被破坏或产生不一致的结果。这种现象称为线程安全问题，也叫**数据竞争 (Data Race)**。

**核心诱因**：
1.  多线程并发
2.  存在共享数据
3.  对共享数据有非原子性的修改操作

```java
class User {
    public String name;
}

public class ThreadSafeIssue {
    public static void main(String[] args) {
        User user = new User(); // 共享资源

        Thread t1 = new Thread(() -> {
            user.name = "zhangsan";
            try { Thread.sleep(100); } catch (Exception e) {}
            // 当t1准备打印时，name可能已经被t2修改了
            System.out.println(user.name); 
        });

        Thread t2 = new Thread(() -> {
            user.name = "lisi";
            try { Thread.sleep(100); } catch (Exception e) {}
            System.out.println(user.name);
        });

        t1.start();
        t2.start(); // 最终输出结果可能是 lisi, lisi，也可能是 zhangsan, lisi，具有不确定性
    }
}
```

---

### 1.6 线程阻塞：`wait()` vs. `sleep()` 的深度辨析

`wait()` 和 `sleep()` 都能使线程暂停，但它们的底层机制和使用场景完全不同，是面试中的高频考点。

|特性|`Object.wait()`|`Thread.sleep(long)`|
|---|---|---|
|**所属类**|`Object` 类的方法|`Thread` 类的静态方法|
|**锁的释放**|**释放锁**。调用 `wait()` 的线程会释放其持有的对象锁，允许其他线程获取该锁。|**不释放锁**。线程休眠时，依然持有对象锁，其他线程无法进入该锁保护的同步代码。|
|**使用环境**|必须在 `synchronized` 同步代码块或同步方法中使用。|可以在任何地方使用。|
|**唤醒方式**|需由其他线程调用同一对象上的 `notify()` 或 `notifyAll()` 来唤醒。|达到指定休眠时间后自动唤醒。|
|**核心用途**|用于线程间的**协作与通信**。|用于暂停当前线程的执行，**让出CPU时间**。|

---

### 1.7 线程池 (Executor Framework) — 现代并发实践

> [!question] 为什么需要线程池？
> - 频繁地创建和销毁线程会消耗大量的系统资源。
> - 无限制地创建线程可能导致内存溢出 (`OutOfMemoryError`)。
> - 缺乏统一的线程管理，难以控制并发度。

**线程池的核心思想**：创建一个包含多个“待命”线程的容器。当有任务需要执行时，从池中取一个空闲线程来执行，任务结束后，线程并不销毁，而是返回池中等待下一个任务。

#### 1.7.1 `Executors` 工具类与常见线程池

`java.util.concurrent.Executors` 提供了一系列静态工厂方法来创建不同类型的线程池。

1.  **`newFixedThreadPool(int n)`**:
    - 创建一个**固定大小**的线程池。核心线程数和最大线程数相同。超出的任务会在队列中等待。
2.  **`newCachedThreadPool()`**:
    - 创建一个**可缓存**的线程池。线程数根据任务量动态调整，没有上限（理论上是`Integer.MAX_VALUE`），适合执行大量耗时短的任务。
3.  **`newSingleThreadExecutor()`**:
    - 创建一个**单线程**的线程池。保证所有任务按提交顺序（FIFO）串行执行。
4.  **`newScheduledThreadPool(int corePoolSize)`**:
    - 创建一个支持**定时及周期性任务执行**的线程池。

```java
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class ThreadPoolDemo {
    public static void main(String[] args) {
        // 创建一个包含3个线程的固定大小线程池
        ExecutorService executorService = Executors.newFixedThreadPool(3);

        // 提交5个任务给线程池
        for (int i = 0; i < 5; i++) {
            executorService.submit(() -> {
                System.out.println("任务由线程 " + Thread.currentThread().getName() + " 执行");
            });
        }

        // 关闭线程池（不再接受新任务，等待已提交任务执行完毕）
        executorService.shutdown();
    }
}
```

> [!check] 现代并发编程范式
> 在实际项目中，**强烈推荐使用线程池来管理线程**，而不是手动 `new Thread()`。这是一种更高效、更稳定、更易于管理的方式。