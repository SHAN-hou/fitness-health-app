package com.shanhou.fitnesshealthapp.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Check
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

data class FitnessGoal(
    val id: Int,
    val type: String,
    val icon: String,
    val target: Float,
    val current: Float,
    val unit: String,
    var isCompleted: Boolean = false
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun GoalsScreen() {
    var goals by remember {
        mutableStateOf(
            listOf(
                FitnessGoal(1, "减重", "⚖️", 5f, 2f, "kg"),
                FitnessGoal(2, "每日步数", "👣", 10000f, 6500f, "步"),
                FitnessGoal(3, "运动时长", "⏱️", 30f, 15f, "分钟/天")
            )
        )
    }
    var showDialog by remember { mutableStateOf(false) }
    
    Scaffold(
        floatingActionButton = {
            FloatingActionButton(
                onClick = { showDialog = true },
                containerColor = MaterialTheme.colorScheme.primary
            ) {
                Icon(Icons.Default.Add, contentDescription = "添加目标", tint = Color.White)
            }
        }
    ) { padding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .background(MaterialTheme.colorScheme.background),
            contentPadding = PaddingValues(16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            item {
                Text(
                    "我的健身目标",
                    fontSize = 20.sp,
                    fontWeight = FontWeight.Bold,
                    modifier = Modifier.padding(bottom = 8.dp)
                )
            }
            
            val activeGoals = goals.filter { !it.isCompleted }
            val completedGoals = goals.filter { it.isCompleted }
            
            if (activeGoals.isEmpty()) {
                item {
                    Card(modifier = Modifier.fillMaxWidth()) {
                        Column(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(48.dp),
                            horizontalAlignment = Alignment.CenterHorizontally
                        ) {
                            Text("🎯", fontSize = 64.sp)
                            Spacer(modifier = Modifier.height(16.dp))
                            Text("还没有设置目标", fontWeight = FontWeight.SemiBold)
                            Text("点击右下角按钮添加目标", color = Color.Gray, fontSize = 14.sp)
                        }
                    }
                }
            } else {
                item { Text("进行中", fontWeight = FontWeight.SemiBold, color = Color.Gray) }
                items(activeGoals) { goal ->
                    GoalCard(
                        goal = goal,
                        onComplete = {
                            goals = goals.map {
                                if (it.id == goal.id) it.copy(isCompleted = true) else it
                            }
                        }
                    )
                }
            }
            
            if (completedGoals.isNotEmpty()) {
                item {
                    Spacer(modifier = Modifier.height(8.dp))
                    Text("已完成", fontWeight = FontWeight.SemiBold, color = Color.Gray)
                }
                items(completedGoals) { goal ->
                    GoalCard(goal = goal, onComplete = {}, isCompleted = true)
                }
            }
        }
    }
    
    if (showDialog) {
        AlertDialog(
            onDismissRequest = { showDialog = false },
            title = { Text("添加新目标") },
            text = { Text("此功能即将推出...") },
            confirmButton = {
                TextButton(onClick = { showDialog = false }) {
                    Text("确定")
                }
            }
        )
    }
}

@Composable
private fun GoalCard(
    goal: FitnessGoal,
    onComplete: () -> Unit,
    isCompleted: Boolean = false
) {
    val progress = (goal.current / goal.target).coerceIn(0f, 1f)
    
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .then(if (isCompleted) Modifier else Modifier),
        colors = CardDefaults.cardColors(
            containerColor = if (isCompleted) Color.Gray.copy(alpha = 0.1f) else MaterialTheme.colorScheme.surface
        )
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Text(goal.icon, fontSize = 32.sp)
                Spacer(modifier = Modifier.width(12.dp))
                Column(modifier = Modifier.weight(1f)) {
                    Text(goal.type, fontWeight = FontWeight.SemiBold)
                    Text(
                        "目标: ${goal.target.toInt()} ${goal.unit}",
                        fontSize = 14.sp,
                        color = Color.Gray
                    )
                }
                if (!isCompleted) {
                    IconButton(onClick = onComplete) {
                        Icon(
                            Icons.Default.Check,
                            contentDescription = "完成",
                            tint = MaterialTheme.colorScheme.primary
                        )
                    }
                }
            }
            
            if (!isCompleted) {
                Spacer(modifier = Modifier.height(12.dp))
                Row(verticalAlignment = Alignment.CenterVertically) {
                    LinearProgressIndicator(
                        progress = progress,
                        modifier = Modifier
                            .weight(1f)
                            .height(8.dp),
                        color = MaterialTheme.colorScheme.primary,
                        trackColor = Color.Gray.copy(alpha = 0.2f)
                    )
                    Spacer(modifier = Modifier.width(12.dp))
                    Text(
                        "${(progress * 100).toInt()}%",
                        fontWeight = FontWeight.SemiBold,
                        color = MaterialTheme.colorScheme.primary
                    )
                }
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    "当前: ${goal.current.toInt()} ${goal.unit}",
                    fontSize = 14.sp,
                    color = Color.Gray
                )
            }
        }
    }
}
